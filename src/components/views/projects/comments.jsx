import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import './comments.scss';
import Button from 'src/components/common/button/button';
import Loading from 'src/components/common/loading/loading';

import CommentApi from 'src/apis/viviboom/CommentApi';
import { CommentOrderType } from 'src/enums/CommentOrderType';

import CommentItem from './comment-item';

const DEFAULT_LIMIT = 9;

function Comments({ projectId }) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const [addCommentLoading, setAddCommentLoading] = useState(false);
  const [addComment, setAddComment] = useState('');

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);

  const scrollToRef = useRef();

  // API calls

  // initial items
  const fetchLatestComments = useCallback(async () => {
    if (!user?.authToken) return;
    const requestParams = {
      authToken: user.authToken,
      projectId,
      isRootCommentsOnly: true,
      limit: DEFAULT_LIMIT,
      offset: 0,
      order: CommentOrderType.LATEST,
    };

    setLoading(true);
    try {
      const res = await CommentApi.getList(requestParams);
      setComments(res.data?.comments);

      setPage(1);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [projectId, user?.authToken]);

  // scroll to load more
  const fetchMoreComments = useCallback(async () => {
    if (!user?.authToken) return;
    if (page < totalPage) {
      setLoading(true);

      const requestParams = {
        authToken: user.authToken,
        projectId,
        isRootCommentsOnly: true,
        limit: DEFAULT_LIMIT,
        offset: comments.length,
        order: CommentOrderType.LATEST,
      };

      try {
        const res = await CommentApi.getList(requestParams);
        setPage((p) => p + 1);
        setComments([...comments, ...(res.data?.comments || [])]);
        setTotalPages(res.data?.totalPages);
      } catch (err) {
        toast.error(err.message);
        console.error(err);
      }

      setLoading(false);
    }
  }, [comments, page, projectId, totalPage, user?.authToken]);

  // refresh all comments
  const fetchComments = useCallback(async () => {
    if (!user?.authToken) return;
    setLoading(true);

    const requestParams = {
      authToken: user.authToken,
      projectId,
      isRootCommentsOnly: true,
      limit: comments.length,
      offset: 0,
      order: CommentOrderType.LATEST,
    };

    try {
      const res = await CommentApi.getList(requestParams);
      setComments(res.data?.comments);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }

    setLoading(false);
  }, [comments?.length, projectId, user?.authToken]);

  useEffect(() => {
    fetchLatestComments();
  }, [fetchLatestComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (addComment.length <= 0) return toast.error(t('Empty comment is not allowed'));
    setAddCommentLoading(true);
    try {
      await CommentApi.post({ authToken: user.authToken, projectId, text: addComment });
      // console.log(res?.data.commentId);
      await fetchLatestComments();
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setAddComment('');
    return setAddCommentLoading(false);
  };

  return (
    <div className="widget-box comment" ref={scrollToRef}>
      <div className="comments-title">
        {t('Comments')}
      </div>
      <div className="comments-detail">
        {
          loading ? (
            <Loading show size="40px" />
          ) : comments.length <= 0 && (
            <div>{t('No comments yet. Be the first!')}</div>
          )
        }
        <ul>
          {comments.map((v) => (
            <li key={`comment_${v.id}`} className="comment">
              <CommentItem
                comment={v}
                rootComment={v}
                fetchComments={fetchComments}
              />
            </li>
          ))}
        </ul>
        <div className="show-more">
          {loading ? <Loading show size="20px" /> : page < totalPage && <button type="button" onClick={fetchMoreComments}>{t('Show More')}</button>}
        </div>

        <div className="add-comment">
          <form onSubmit={handleAddComment}>
            <textarea
              onChange={(e) => setAddComment(e.target.value)}
              value={addComment}
              placeholder={t('Add comment')}
            />
            <div className="add-comment-button">
              <Button
                type="submit"
                status={addCommentLoading ? 'loading' : 'add'}
                value={t('Add Comment')}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Comments;
