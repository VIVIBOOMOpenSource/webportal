import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import './comment-item.scss';

import Button from 'src/components/common/button/button';
import MyImage from 'src/components/common/MyImage';
import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';

import * as DateUtil from 'src/utils/date';
import { getCountryFlag } from 'src/utils/countries';

import CommentApi from 'src/apis/viviboom/CommentApi';

const DEFAULT_PROFILE_IMAGE_SIZE = 256;

function CommentItem({ comment, rootComment, fetchComments }) {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const user = useSelector((state) => state?.user);

  // edit comment
  const [editCommentText, setEditCommentText] = useState(comment.text);
  const [editComment, setEditComment] = useState(false);
  const [saveCommentLoading, setSaveCommentLoading] = useState(false);

  // like comment
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLikes, setCommentLikes] = useState(comment.likeCount);
  const [isUserLiked, setUserLiked] = useState(!!comment.likes.find((l) => l.userId === user.id));

  // reply comment
  const [showAddReply, setShowAddReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyCommentLoading, setReplyCommentLoading] = useState(false);

  // flag comment
  const [flagCommentLoading, setFlagCommentLoading] = useState(false);

  // delete comment
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditComment = async (e) => {
    e.preventDefault();
    setSaveCommentLoading(true);
    try {
      await CommentApi.patch({ authToken: user.authToken, commentId: comment.id, text: editCommentText });

      // reload to show new comments
      await fetchComments();
      setEditComment(false);
      toast.success(t('Comment Edited!'));
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }

    setSaveCommentLoading(false);
  };

  const handleLikeComment = async () => {
    setLikeLoading(true);
    try {
      const res = await CommentApi.like({ authToken: user.authToken, commentId: comment.id, isLike: !isUserLiked });
      setCommentLikes(res.data?.likeCount);
      setUserLiked(res.data?.isLike);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
    setLikeLoading(false);
  };

  const handleDeleteComment = async () => {
    if (!window.confirm(t('Are you sure you want to delete this comment?'))) {
      return;
    }

    setDeleteLoading(true);
    try {
      await CommentApi.deleteComment({ authToken: user.authToken, commentId: comment.id });
      setDeleteLoading(false);
      // reload to show new comments
      await fetchComments();
      toast.success(t('Comment Deleted!'));
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  const handleReplyComment = async (e) => {
    e.preventDefault();

    if (replyText.length <= 0) return toast.error(t('Empty comment is not allowed'));
    setReplyCommentLoading(true);
    try {
      await CommentApi.post({
        authToken: user.authToken, projectId: comment.projectId, text: replyText, parentCommentId: rootComment.id,
      });

      // reload to show new comments
      await fetchComments();
      setShowAddReply(false);
      toast.success(t('Comment Replied!'));
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }

    return setReplyCommentLoading(false);
  };

  const handleFlagComment = async () => {
    if (!window.confirm(t('Do you want to flag this comment for review?'))) return;

    if (comment.isFlagged) {
      toast.error(t('This comment is already flagged'));
      return;
    }

    setFlagCommentLoading(true);
    try {
      await CommentApi.patch({ authToken: user.authToken, commentId: comment.id, isFlagged: true });

      // reload to show new comments
      await fetchComments();

      toast.info(t('Thanks! This comment has been flagged for review'));
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }

    setFlagCommentLoading(false);
  };

  return (
    <div className="comment-item">
      <div className="user-profile-picture">
        <div className="poster-image">
          <MyImage
            src={comment.user.profileImageUri}
            alt={comment.user.name}
            defaultImage={DefaultProfilePicture}
            width={DEFAULT_PROFILE_IMAGE_SIZE}
          />
        </div>

        <img className="user-profile-country" alt="country" src={getCountryFlag(comment.user.branch?.countryISO)} />
      </div>
      <div className="comment-detail">
        <div className="comment-header">
          <div>{comment.user.name}</div>
          <div>
            {DateUtil.dateTimeSince(comment.createdAt)}
          </div>
        </div>
        <div className="comment-body">
          {editComment ? (
            <div className="edit-comment">
              <form onSubmit={handleEditComment}>
                <textarea
                  placeholder="Edit Comment"
                  disabled={saveCommentLoading}
                  onChange={(e) => setEditCommentText(e.target.value)}
                  value={editCommentText}
                />
                <div className="buttons">
                  <Button
                    parentClassName="clear"
                    type="button"
                    onClick={() => setEditComment(false)}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button parentClassName="save" status={saveCommentLoading ? 'loading' : 'save'} type="submit" value={t('Save Changes')} />
                </div>
              </form>
            </div>
          ) : (
            comment.text
          )}
        </div>
        <div className="comment-footer">
          <Button
            parentClassName={isUserLiked ? 'user-liked' : ''}
            type="button"
            status={likeLoading ? 'loading' : 'thumbs-up'}
            loadingSize="20px"
            onClick={handleLikeComment}
          >
            {t('like')}
          </Button>
          <div className="likes">{commentLikes}</div>
          <Button
            type="button"
            status="reply"
            onClick={() => setShowAddReply(true)}
          >
            {t('reply')}
          </Button>
          {comment.userId !== user.id && (
            <Button
              type="button"
              status={flagCommentLoading ? 'loading' : 'flag'}
              onClick={handleFlagComment}
            >
              {t('flag')}
            </Button>
          )}
          {comment.userId === user.id ? (
            <Button
              type="button"
              status="edit"
              onClick={() => setEditComment(true)}
            >
              {t('edit')}
            </Button>
          ) : (
            ''
          )}
          {comment.userId === user.id ? (
            <Button
              type="button"
              status={deleteLoading ? 'loading' : 'delete'}
              onClick={handleDeleteComment}
            >
              {t('delete')}
            </Button>
          ) : (
            ''
          )}
        </div>
        {showAddReply && (
          <div className="reply-comment">
            <form onSubmit={handleReplyComment}>
              <textarea
                placeholder={t('reply')}
                disabled={replyCommentLoading}
                onChange={(e) => setReplyText(e.target.value)}
                value={replyText}
              />
              <div className="buttons">
                <Button
                  parentClassName="clear"
                  type="button"
                  onClick={() => setShowAddReply(false)}
                >
                  {t('Cancel')}
                </Button>
                <Button parentClassName="reply" status={replyCommentLoading ? 'loading' : 'reply'} type="submit" value={t('Add Reply')} />
              </div>
            </form>
          </div>
        )}
        {comment?.childComments.length > 0 && (
          <ul className="sub-comments">
            {comment.childComments.map((v) => (
              <li key={`child-comment_${v.id}`}>
                <CommentItem comment={v} rootComment={rootComment} fetchComments={fetchComments} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
