import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import './edit-portfolio.scss';

import ProjectApi from 'src/apis/viviboom/ProjectApi';
import { ProjectOrderType } from 'src/enums/ProjectOrderType';
import Loading from 'src/components/common/loading/loading';
import Pagination from 'src/components/common/pagination/pagination';
import MyImage from 'src/components/common/MyImage';
import DefaultProjectPicture from 'src/css/imgs/boom-imgs/project/default-project-picture.png';

const DEFAULT_PROJECT_ITEM_IMAGE_WIDTH = 512;
const DEFAULT_LIMIT = 9;

function EditPortfolio() {
  const { t } = useTranslation('translation', { keyPrefix: 'myAccount' });
  const user = useSelector((state) => state?.user);
  const [loading, setLoading] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [currentSelectedProjects, setCurrentSelectedProjects] = useState([]);
  const [previousSelectedProjects, setPreviousSelectedProjects] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const unselectedProjectsRef = useRef(null);

  const fetchSelectedProjects = useCallback(async () => {
    if (!user?.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      order: ProjectOrderType.LATEST,
      authorUserId: user.id,
      isPublished: true,
      isCompleted: true,
      isSelected: true,
    };
    setLoading(true);
    try {
      const res = await ProjectApi.getList(requestParams);
      const projects = res.data?.projects;
      const sortedSelectedProjects = projects
        .sort((a, b) => a.projectOrder - b.projectOrder);
      setCurrentSelectedProjects(sortedSelectedProjects);
      setPreviousSelectedProjects(sortedSelectedProjects);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.id, user.authToken]);

  const fetchAllProjects = useCallback(async () => {
    if (!user?.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      order: ProjectOrderType.LATEST,
      authorUserId: user.id,
      isPublished: true,
      isCompleted: true,
    };
    setLoading(true);
    try {
      const res = await ProjectApi.getList(requestParams);
      setAllProjects(res.data?.projects);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.id, user.authToken, page]);

  const handleProjectToggle = (project) => () => {
    if (!currentSelectedProjects.find((b) => b.id === project.id)) {
      setCurrentSelectedProjects([...currentSelectedProjects, project]);
    } else {
      setCurrentSelectedProjects(currentSelectedProjects.filter((b) => b.id !== project.id));
    }
  };

  const handleSaveProjects = async () => {
    if (!user?.authToken) return;
    const patchUnSelectedProjects = previousSelectedProjects
      .filter((project) => !currentSelectedProjects.some((currentProject) => currentProject.id === project.id))
      .map((project, index) => {
        const requestParams2 = {
          authToken: user.authToken,
          projectId: project.id,
          isSelected: false,
          projectOrder: index + 1,
        };
        return ProjectApi.patch(requestParams2);
      });

    const patchSelectedProjects = currentSelectedProjects.map((project, index) => {
      const requestParams2 = {
        authToken: user.authToken,
        projectId: project.id,
        isSelected: true,
        projectOrder: index + 1,
      };
      return ProjectApi.patch(requestParams2);
    });

    try {
      await Promise.all([...patchUnSelectedProjects, ...patchSelectedProjects]);
      toast.success('Changes saved');
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    unselectedProjectsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedProjects = Array.from(currentSelectedProjects);
    const [movedProject] = updatedProjects.splice(source.index, 1);
    updatedProjects.splice(destination.index, 0, movedProject);
    setCurrentSelectedProjects(updatedProjects);
  };

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  useEffect(() => {
    fetchSelectedProjects();
  }, [fetchSelectedProjects]);

  return (
    <div className="edit-portfolio">
      <div className="edit-portfolio-header-container">
        <div className="edit-portfolio-header-title-container">
          <p className="edit-portfolio-title">{t('Edit Portfolio')}</p>
          <p className="title-description">{t('Select and reorder projects to put in your portfolio!')}</p>
        </div>
      </div>
      <div className="separator-container">
        <Link className="button" to={`/view-portfolio/${user?.id}`}>
          {t('View Public Portfolio')}
        </Link>
      </div>
      <div className="body">
        <div className="selected-projects">
          <div className="section-title selected">
            {t('Selected Projects')}
          </div>
          <div className="section-subtext">
            {t('Drag and drop the projects to change the order they appear on your public portfolio page')}
          </div>
          <div className="member-projects">
            {currentSelectedProjects?.length === 0 && <div className="no-projects">{t('No projects have been selected by this member yet')}</div>}
            <div className="project-div">
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="project-list" direction="horizontal">
                  {(provided) => (
                    <ul className="project-list" {...provided.droppableProps} ref={provided.innerRef}>
                      {currentSelectedProjects.map((v, index) => (
                        <Draggable key={v.id} draggableId={v.id.toString()} index={index}>
                          {(provided) => (
                            <li key={`user-project+${v.id}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <div className="project-item-container selected">
                                <div className="project-item-image">
                                  <MyImage
                                    src={v?.thumbnailUri || v?.images[0]?.uri}
                                    alt="project"
                                    width={DEFAULT_PROJECT_ITEM_IMAGE_WIDTH}
                                    defaultImage={DefaultProjectPicture}
                                  />
                                </div>
                                <div className="project-item-details">
                                  <div className="project-item-title">
                                    {v?.name}
                                  </div>
                                  <div className={v?.description === '' ? 'no-project-item-desc' : 'project-item-desc'}>{v?.description}</div>
                                </div>
                                <div>
                                  <button onClick={handleProjectToggle(v)} type="submit" className="project-button remove">{t('Remove Project')}</button>
                                </div>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
          <div className="save-button-container">
            <button onClick={handleSaveProjects} type="submit" className="save-button">{t('Save')}</button>
          </div>
        </div>
        <div className="selected-projects">
          <div className="title-and-button">
            <div className="section-title">
              {t('All Projects')}
            </div>
          </div>
          <div className="member-projects" ref={unselectedProjectsRef}>
            {allProjects?.length === 0 && <div className="no-projects">{t('You do not have any projects listed')}</div>}
            <ul className="project-list unselected">
              {allProjects.map((v) => (
                <li key={`user-project+${v.id}`}>
                  <div className={`project-item-container${currentSelectedProjects.find((p) => p.id === v.id) ? ' is-selected' : ''}`}>
                    <div className="project-item-image">
                      <MyImage
                        src={v?.thumbnailUri || v?.images[0]?.uri}
                        alt="project"
                        width={DEFAULT_PROJECT_ITEM_IMAGE_WIDTH}
                        defaultImage={DefaultProjectPicture}
                        isLoading={loading}
                      />
                    </div>
                    <Loading show={loading} size="24px" />
                    <div className="project-item-details">
                      <div className="project-item-title">
                        {v?.name}
                      </div>
                      <div className={v?.description === '' ? 'no-project-item-desc' : 'project-item-desc'}>{v?.description}</div>
                    </div>
                    <div>
                      {currentSelectedProjects.find((p) => p.id === v.id) ? <span className="selected-text">{t('Selected! Scroll up to rearrange / remove project!')}</span> : <button onClick={handleProjectToggle(v)} type="submit" className="project-button">{t('Select Project')}</button>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="member-main-footer">
            {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} setPage={handlePageChange} scrollToRef={unselectedProjectsRef} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPortfolio;
