import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { WithContext as ReactTags } from 'react-tag-input';
import { toast } from 'react-toastify';

import './tag-input.scss';

import ProjectCategoryApi from 'src/apis/viviboom/ProjectCategoryApi';
import Loading from 'src/components/common/loading/loading';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function TagInput({ projectCategories, setProjectCategories, markDocumentDirty }) {
  const authToken = useSelector((state) => state?.user?.authToken);

  const [isLoading, setLoading] = useState(false);
  const [allProjectCategories, setAllProjectCategories] = useState([]);

  // API calls
  const fetchProjectCategories = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await ProjectCategoryApi.getList({ authToken });
      setAllProjectCategories(res.data?.projectCategories);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [authToken]);

  useEffect(() => {
    fetchProjectCategories();
  }, [fetchProjectCategories]);

  const handleDelete = (index) => {
    const newProjectCategories = [...projectCategories];
    newProjectCategories.splice(index, 1);
    setProjectCategories(newProjectCategories);
    markDocumentDirty();
  };

  const handleAddition = async (newProjectCategory) => {
    let category = allProjectCategories.find((c) => c.id === Number(newProjectCategory.id));

    // if doesn't exists in predefined categories, post on server
    if (!category) {
      setLoading(true);
      try {
        const res = await ProjectCategoryApi.post({ authToken, name: newProjectCategory.text });
        category = { id: res.data?.projectCategoryId, name: newProjectCategory.text };
      } catch (err) {
        toast.error(err.message);
        console.error(err);
      }
      setLoading(false);
      setAllProjectCategories(allProjectCategories.concat(category));
    }
    setProjectCategories(projectCategories.concat(category));
    markDocumentDirty();
  };

  const tags = projectCategories.map((c) => ({ id: `${c.id}`, text: c.name }));
  const suggestions = allProjectCategories.map((c) => ({ id: `${c.id}`, text: c.name }));

  return (
    <div className="tag-input">
      <Loading show={isLoading} size="40px" />
      <ReactTags
        autocomplete
        tags={tags}
        suggestions={suggestions}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        delimiters={delimiters}
        allowDragDrop={false}
        minQueryLength={0}
        allowDeleteFromEmptyInput={false}
        autofocus={false}
      />
    </div>
  );
}

export default TagInput;
