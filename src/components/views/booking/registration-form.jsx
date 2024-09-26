import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import './registration-form.scss';
import { DateTime } from 'luxon';
import { EventQuestionType } from 'src/enums/EventQuestionType';
import { EventQuestionDestinationType } from 'src/enums/EventQuestionDestinationType';
import Loading from 'src/components/common/loading/loading';

function ResgistrationForm({ eventSession, setHideForm, bookSession }) {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const { eventQuestions } = eventSession;

  const [input, setInput] = useState({});
  const [isLoading, setLoading] = useState(false);

  const bookingQuestions = eventQuestions?.filter((q) => q.destination === EventQuestionDestinationType.BOOKING);
  // sort question based on the order attribute
  bookingQuestions?.sort((q1, q2) => Number(q1.order) - Number(q2.order));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const responses = [];

    bookingQuestions?.forEach((q) => {
      if (q.type === EventQuestionType.MULTIPLE) responses.push(...input[q.id].map((response) => ({ eventQuestionId: q.id, response })));
      else responses.push({ eventQuestionId: q.id, response: input[q.id] });
    });

    setLoading(true);
    await bookSession(responses);
    setLoading(false);
    setHideForm(true);
  };

  // multiple response questions are special case. An array attribute is added for input element to track whether the boxes are checked.
  // a value atribute is added for input elememt to track what are the responses to submit.
  const handleMultiResponse = (event, eventQuestionId) => {
    const multiQuestionResponses = [...(input[eventQuestionId] ?? [])];

    // find the index of the changed option if exists
    const modifiedIdx = multiQuestionResponses.findIndex((r) => r === event.target.value);

    // if exists and unchecked, delete, if does not exists and checked, insert
    if (modifiedIdx >= 0) {
      if (!event.target.checked) multiQuestionResponses.splice(modifiedIdx, 1);
    } else if (event.target.checked) multiQuestionResponses.push(event.target.value);
    setInput({ ...input, [eventQuestionId]: multiQuestionResponses });
  };
  return (
    <div className="registration-info">
      <p className="registration-title">{eventSession.title}</p>
      <p className="registration-subtitle">{DateTime.fromISO(eventSession.startAt).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</p>

      <form className="registration-form" onSubmit={handleSubmit}>

        {bookingQuestions && bookingQuestions.map((q) => {
          switch (q.type) {
            case (EventQuestionType.SINGLE):
              return (
                <label key={`question_${q.id}`}>
                  {q.question}
                  <select required onChange={(e) => setInput({ ...input, [q.id]: e.target.value })}>
                    <option value="" default>{t('Select an option')}</option>
                    {q.answerOptions.map((option) => <option value={option.answer} key={option.id}>{option.answer}</option>)}
                  </select>
                </label>
              );
            case (EventQuestionType.MULTIPLE):
              return (
                <div key={`question_${q.id}`} className="multiple">
                  {q.question}
                  <fieldset>
                    {q.answerOptions.map((option) => (
                      <label className="form-option" key={option.id}>
                        <input
                          type="checkbox"
                          value={option.answer}
                          onChange={(e) => handleMultiResponse(e, q.id)}
                        />
                        {option.answer}
                      </label>
                    ))}
                  </fieldset>
                  <input className="required-box" type="text" required={!(input[q.id] && input[q.id].length > 0)} />
                </div>
              );
            case (EventQuestionType.TEXT):
              return (
                <label key={`question_${q.id}`}>
                  {q.question}
                  <textarea
                    required
                    placeholder="your answer"
                    onChange={(e) => setInput({ ...input, [q.id]: e.target.value })}
                  />
                </label>
              );
            default:
              break;
          }
          return null;
        })}

        <div className="registration-actions">
          <button className="registration-button button primary" onClick={() => setHideForm(true)}>{t('Back')}</button>
          <button className="registration-button button secondary" type="submit" value="Submit" id="bookButton" disabled={isLoading}>{!isLoading ? t('Submit') : <Loading show size="24px" />}</button>
        </div>
      </form>
    </div>
  );
}

export default ResgistrationForm;
