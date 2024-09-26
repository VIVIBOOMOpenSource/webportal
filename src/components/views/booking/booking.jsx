import './booking.scss';

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
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

import { CountryFlagType, getCountryFlag } from 'src/utils/countries';

import BookingApi from 'src/apis/viviboom/BookingApi';
import BranchApi from 'src/apis/viviboom/BranchApi';
import EventApi from 'src/apis/viviboom/EventApi';
import EventQuotaApi from 'src/apis/viviboom/EventQuotaApi';
import UserApi from 'src/apis/viviboom/UserApi';

import { EventType } from 'src/enums/EventType';
import { EventOrderType } from 'src/enums/EventOrderType';
import { BookingStatusType } from 'src/enums/BookingStatusType';

import Loading from 'src/components/common/loading/loading';
import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import { PublicAccessType } from 'src/enums/PublicAccessType';
import WorkshopItem from './workshop-item';
import Sessions from './sessions';
import { ReactComponent as BigArrowSvg } from '../../../css/imgs/icon-big-arrow.svg';

const DEFAULT_WEEKDAY_QUOTA = 999;
const DEFAULT_WEEKEND_QUOTA = 2;

function Booking() {
  const { t } = useTranslation('translation', { keyPrefix: 'booking' });
  const user = useSelector((state) => state?.user);
  const userId = user.id;

  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(user?.branchId || -1);
  const [branchesLoading, setBranchesLoading] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [eventSessions, setEventSessions] = useState([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([]);
  const [freeflow, setFreeflow] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [weekdayQuota, setWeekdayQuota] = useState(DEFAULT_WEEKDAY_QUOTA);
  const [weekendQuota, setWeekendQuota] = useState(DEFAULT_WEEKEND_QUOTA);
  const [weekdaysUnusedQuota, setWeekdaysUnusedQuota] = useState(0);
  const [weekendsUnusedQuota, setWeekendsUnusedQuota] = useState(0);
  const [userBookings, setUserBookings] = useState([]);

  // API Calls
  const fetchBranches = useCallback(async () => {
    if (!user?.authToken) return;
    setBranchesLoading(true);
    try {
      const res = await BranchApi.getList({ authToken: user.authToken });
      const fetchedBranches = res.data?.branches.map((branch) => ({
        ...branch,
        countryFlag: getCountryFlag(branch.countryISO, CountryFlagType.EMOJI),
      }));

      const userBranch = fetchedBranches.find((b) => b.id === user.branchId);
      const remainingBranches = fetchedBranches
        .filter((b) => b.id !== user.branchId)
        .sort((b1, b2) => {
          const compareResult = b1.countryISO.localeCompare(b2.countryISO);
          if (compareResult === 0) return b1.name.localeCompare(b2.name);
          return compareResult;
        });
      setBranches([userBranch, ...remainingBranches]);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setBranchesLoading(false);
  }, [user?.authToken, user?.branchId]);

  const getEventSessions = useCallback(async () => {
    if (!user?.authToken) return;
    try {
      const res = await EventApi.getList({
        authToken: user.authToken,
        branchId,
        startDate: moment().startOf('day').utc().format(),
        order: EventOrderType.OLDEST,
        isBeforeBookingEnd: true,
        publicAccessTypes: [PublicAccessType.NONE, PublicAccessType.VIEW, PublicAccessType.BOOK],
      });
      setEventSessions(res.data?.events);
      setUpcomingWorkshops(res.data?.events.filter((e) => e.type === EventType.WORKSHOP));
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  }, [branchId, user?.authToken]);

  const getUserBookings = useCallback(async () => {
    try {
      const res = await BookingApi.getList({ authToken: user.authToken, userId, startDate: moment().startOf('day').utc().format() });

      setUserBookings(res.data?.bookings);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  }, []);

  const getEventQuota = useCallback(async () => {
    try {
      const res = await EventQuotaApi.getList({ authToken: user.authToken, month: currentMonth.getMonth() + 1, year: currentMonth.getFullYear() });
      if (res.data?.eventQuotas?.length > 0) {
        setWeekdayQuota(res.data.eventQuotas[0].weekdays);
        setWeekendQuota(res.data.eventQuotas[0].weekends);
      }
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  }, [currentMonth]);

  const getUserBookingQuota = useCallback(async () => {
    try {
      const res = await UserApi.getUserBookingQuota({
        authToken: user.authToken, userId, month: currentMonth.getMonth() + 1, year: currentMonth.getFullYear(),
      });

      setWeekdaysUnusedQuota(res.data.userBookingQuota.weekdaysUnusedQuota);
      setWeekendsUnusedQuota(res.data.userBookingQuota.weekendsUnusedQuota);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  }, [currentMonth]);

  // useEffects
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    getEventSessions();
  }, [getEventSessions]);

  const refreshSessions = async () => {
    await getUserBookings();
    await getUserBookingQuota();
    await getEventQuota();
  };

  useEffect(() => {
    refreshSessions();
  }, [currentMonth]);

  useEffect(() => {
    const eventsOnSelectedDay = eventSessions.filter((e) => isSameDay(selectedDay, new Date(e.startAt)));

    setFreeflow(eventsOnSelectedDay.filter((e) => e.type === EventType.FREE_FLOW));
    setWorkshops(eventsOnSelectedDay.filter((e) => e.type === EventType.WORKSHOP));
  }, [selectedDay, eventSessions]);

  // rendering
  const renderDays = () => {
    const dateFormatShort = 'E';
    const dateFormatLong = 'EEEE';
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
    // return <div className="calendar-week">{days.map((day) => day)}</div>;
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
                isBefore(day, startOfDay(new Date())) ? 'past ' : (hasUserBookings(day, 'day')) ? 'booked ' : hasEventSessions(day) ? 'active ' : 'inactive '
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

  const hasEventSessions = (day) => eventSessions.find((e) => isSameDay(day, new Date(e.startAt))) !== undefined;

  const hasUserBookings = (day) => (userBookings.find((b) => b.status === BookingStatusType.APPROVED && isSameDay(day, new Date(b.event.startAt))) !== undefined);

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

  const handleBranchChange = (id) => () => {
    setBranchId(id);
    setCurrentMonth(new Date());
    setSelectedDay(new Date());
  };

  return (
    <div className="booking">
      <Joyride sectionType={TutorialSectionType.BOOKINGS} />
      <div className="members-header-container">
        <div className="members-header-title-container">
          <p className="members-title">{t('Bookings')}</p>
          <p className="title-description">{t(user?.institutionId === 1 ? 'Book a visit to VIVISTOP!' : 'Register for upcoming workshops and events!')}</p>
        </div>
      </div>
      <div className="separator-container">
        <Link className="button" to="/my-bookings">
          {t('View My Bookings')}
        </Link>
      </div>

      <div className="body">
        <div className="countries">
          <Loading show={branchesLoading} size="24px" />
          <ul>
            {branches
              .map((v) => (
                <li
                  className={branchId === v.id ? 'active' : ''}
                  onClick={handleBranchChange(v.id)}
                  key={`branch-${v.id}`}
                >
                  {`${v.name} ${v.countryFlag}`}
                </li>
              ))}
          </ul>
        </div>
        <div className="section-header">
          <div className="section-header-info">
            <h2 className="section-title">{t('Booking Calendar')}</h2>
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
            {/* <Loading show={loading} size="50px" /> */}
            <div className="calendar full">
              {renderDays()}
              {renderCells()}
            </div>
          </div>
          <Sessions
            selectedDay={selectedDay}
            weekdaysUnusedQuota={weekdaysUnusedQuota}
            weekendsUnusedQuota={weekendsUnusedQuota}
            weekdayQuota={weekdayQuota}
            weekendQuota={weekendQuota}
            freeflow={freeflow}
            workshops={workshops}
            userBookings={userBookings}
            currentMonth={currentMonth}
            refreshSessions={refreshSessions}
          />
        </div>

        <div className="section-header">
          <div className="section-header-info">
            <h2 className="section-title">{t('Events and Workshops')}</h2>
          </div>
        </div>

        {!upcomingWorkshops.length && (
          <div className="no-workshop">
            <h3>{t('There are no upcoming workshops at the moment. Check back soon!')}</h3>
          </div>
        )}
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
      </div>
    </div>
  );
}

export default Booking;
