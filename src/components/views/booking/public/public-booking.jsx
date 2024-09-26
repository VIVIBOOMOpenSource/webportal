import './public-booking.scss';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  addMonths,
  subMonths,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isBefore,
  isSameMonth,
  startOfDay,
} from 'date-fns';
import { DateTime } from 'luxon';
import moment from 'moment';

import PublicEventApi from 'src/apis/viviboom/PublicEventApi';
import PublicBranchApi from 'src/apis/viviboom/PublicBranchApi';

import { CountryFlagType, getCountryFlag } from 'src/utils/countries';

import { EventType } from 'src/enums/EventType';
import { EventOrderType } from 'src/enums/EventOrderType';

import Loading from 'src/components/common/loading/loading';
import WorkshopItem from '../workshop-item';
import PublicSessions from './public-sessions';
import { ReactComponent as BigArrowSvg } from '../../../../css/imgs/icon-big-arrow.svg';

const branchIdToCode = {
  1: ['sg', 'singapore', 'ke', 'sandbox', 'kampongeunos', 'kampong-eunos'],
  2: ['ph', 'philippines', 'baguio'],
  3: ['ee', 'estonia', 'telliskivi', 'tallinn'],
  4: ['lt', 'lithuania', 'vz', 'uzupis', 'hu', 'vilnius'],
  5: ['jp', 'japan'],
  6: ['us', 'hawaii', 'hi', 'honolulu', 'aloha'],
  7: ['nz', 'newzealand', 'new-zealand', 'kiwi', 'aotearoa', 'welly', 'wellington'],
};

export const getBranchIdFromCode = (code) => {
  if (typeof code === 'number') return code;
  const lowerCode = code.toLowerCase();
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in branchIdToCode) {
    if (key === lowerCode || branchIdToCode[key].find((c) => c === lowerCode)) return +key;
  }
  return +lowerCode;
};

function PublicBooking() {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });

  const params = useParams();
  const { code } = params;

  const [isLoading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [eventSessions, setEventSessions] = useState([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([]);
  const [freeflow, setFreeflow] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [branch, setBranch] = useState(null);

  const branchId = useMemo(() => getBranchIdFromCode(code), [code]);

  // API Calls
  const getEventSessions = useCallback(async () => {
    if (!branch) return;
    setLoading(true);
    try {
      const res = await PublicEventApi.getList({
        institutionId: branch?.institutionId,
        branchId,
        startDate: moment().startOf('day').utc().format(),
        order: EventOrderType.OLDEST,
        imageWidth: 512,
        isBeforeBookingEnd: true,
      });
      setEventSessions(res.data?.events);
      setUpcomingWorkshops(res.data?.events.filter((e) => e.type === EventType.WORKSHOP));
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
    setLoading(false);
  }, [branch, branchId]);

  const getBranch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await PublicBranchApi.get({ branchId });
      const fetchedBranch = res.data?.branch;
      setBranch({
        ...fetchedBranch,
        countryFlag: getCountryFlag(fetchedBranch.countryISO, CountryFlagType.EMOJI),
      });
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, [branchId]);

  // useEffects
  useEffect(() => {
    getBranch();
  }, [getBranch]);

  useEffect(() => {
    getEventSessions();
  }, [branch, getEventSessions]);

  useEffect(() => {
    const eventsOnSelectedDay = eventSessions.filter((e) => isSameDay(selectedDay, new Date(e.startAt)));

    setFreeflow(eventsOnSelectedDay.filter((e) => e.type === EventType.FREE_FLOW));
    setWorkshops(eventsOnSelectedDay.filter((e) => e.type === EventType.WORKSHOP));
  }, [selectedDay, eventSessions]);

  const onDateClick = (day, month) => {
    if (!isBefore(day, startOfDay(new Date()))) {
      document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
      setSelectedDay(day);
      if (month !== currentMonth.getMonth()) {
        setCurrentMonth(day);
      }
    }
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const prevMonth = () => {
    if (!isBefore(currentMonth, endOfMonth(new Date()))) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  const hasEventSessions = (day) => eventSessions.find((e) => isSameDay(day, new Date(e.startAt))) !== undefined;

  // rendering
  const renderDays = () => {
    const days = [];

    const startDate = DateTime.fromJSDate(startOfWeek(currentMonth));

    for (let i = 0; i < 7; i += 1) {
      days.push(
        <p className="calendar-week-day" key={i}>
          <span className="week-day-short">{startDate.plus({ days: i }).weekdayShort}</span>
        </p>,
      );
    }

    return <div className="calendar-week">{days}</div>;
  };

  const renderWorkshopDots = (day) => {
    const workshopsOnThisDay = eventSessions.filter((e) => e.type === EventType.WORKSHOP && isSameDay(day, new Date(e.startAt)));
    return <div className="calendar-day-events">{workshopsOnThisDay.map((e) => <p className="calendar-day-event" key={e.id} />)}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];

    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={`day-${day.getTime()}`}
            className={
              `calendar-day ${
                isBefore(day, startOfDay(new Date())) ? 'past ' : hasEventSessions(day) ? 'active ' : 'inactive '
              }${isSameDay(day, selectedDay) ? 'current ' : ''
              }${isSameMonth(day, currentMonth) ? '' : 'other-month'}`
            }
            onClick={() => {
              onDateClick(cloneDay, cloneDay.getMonth());
            }}
          >
            <div className="calendar-day-number">{DateTime.fromJSDate(day).day}</div>
            {renderWorkshopDots(day)}
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-day-row" key={day}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="calendar-days">{rows}</div>;
  };

  return (
    <div className="public-booking">
      <div className="members-header-container">
        <div className="members-header-title-container">
          <p className="members-title">{t('Public Events')}</p>
          <p className="country-title">{(isLoading || !branch) ? '' : `${branch.name} ${branch.countryFlag}`}</p>
          <p className="title-description">{t('Find out more about all our upcoming events and workshops!')}</p>
        </div>
      </div>
      <div className="body">
        <div className="section-header">
          <div className="section-header-info">
            <h2 className="section-title">{t('Events and Workshops')}</h2>
          </div>
        </div>

        {!upcomingWorkshops.length && !isLoading && (
          <div className="no-workshop">
            <h3>{t('There are no upcoming workshops at the moment. Check back soon!')}</h3>
          </div>
        )}
        {isLoading && <div className="no-workshop"><Loading show size="16px" /></div>}

        <ul className="home-options">
          {upcomingWorkshops.map((v) => (
            <WorkshopItem
              key={v.id}
              eventSession={v}
              onWorkshopClick={() => {
                const time = new Date(v.startAt);
                setSelectedDay(time);
                setCurrentMonth(time);
                document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </ul>
        <div className="section-header">
          <div className="section-header-info">
            <h2 className="section-title">{t('Calendar')}</h2>
          </div>
        </div>
        <div className="calendar-container" id="events">
          <div className="calendar-widget">
            <div className="calendar-widget-header">
              <div className="calendar-widget-header-actions">
                <div className="slider-controls">
                  <div className={`slider-control left ${isBefore(currentMonth, endOfMonth(new Date())) && 'invalid'}`} onClick={prevMonth}>
                    <BigArrowSvg className="slider-control-icon icon-big-arrow" />
                  </div>

                  <div className="slider-control right" onClick={nextMonth}>
                    <BigArrowSvg className="slider-control-icon icon-big-arrow" />
                  </div>
                </div>

                <p className="calendar-widget-title">{DateTime.fromJSDate(currentMonth).toFormat('MMMM yyyy')}</p>
              </div>
            </div>
            <div className="calendar full">
              {renderDays()}
              {renderCells()}
            </div>
          </div>
          <PublicSessions
            selectedDay={selectedDay}
            freeflow={freeflow}
            workshops={workshops}
            currentMonth={currentMonth}
          />
        </div>
      </div>
    </div>
  );
}

export default PublicBooking;
