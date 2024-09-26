import './projects.scss';

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import ProjectApi from 'src/apis/viviboom/ProjectApi';
import ProjectCategoryApi from 'src/apis/viviboom/ProjectCategoryApi';
import { ProjectFilterType } from 'src/enums/ProjectFilterType';
import { ProjectOrderType } from 'src/enums/ProjectOrderType';
import Carousel from 'react-multi-carousel';
import Joyride from 'src/components/common/joyride/joyride';
import TutorialSectionType from 'src/enums/TutorialSectionType';
import ProjectItem from './project-item';
import Loading from '../../common/loading/loading';
import Pagination from '../../common/pagination/pagination';
import { ReactComponent as SearchSvg } from '../../../css/imgs/icon-search.svg';
import { ReactComponent as LeftSvg } from '../../../css/imgs/left-arrow.svg';
import { ReactComponent as RightSvg } from '../../../css/imgs/right-arrow.svg';

import 'react-multi-carousel/lib/styles.css';

const DEFAULT_LIMIT = 9;

function ButtonGroup({
  next, previous, goToSlide, ...rest
}) {
  return (
    <div className="carousel-button-group">
      <div className="arrow-button" onClick={() => previous()}>
        <LeftSvg className="category-arrow-icon" />
      </div>
      <div className="arrow-button" onClick={() => next()}>
        <RightSvg className="category-arrow-icon" />
      </div>
    </div>
  );
}

function Projects() {
  const { t } = useTranslation('translation', { keyPrefix: 'projects' });
  const user = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  // const [ categoriesLoading, setCategoriesLoading ] = useState(false);
  const [projectCategoryId, setProjectCategoryId] = useState(-1);
  const [projectCategories, setProjectCategories] = useState([]);

  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [searchKeywords, setSearchKeywords] = useState('');

  const [projectFilter, setProjectFilter] = useState(ProjectFilterType.LATEST);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 12,
      slidesToSlide: 8,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 6,
      slidesToSlide: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2.4,
      slidesToSlide: 2,
    },
  };

  // API calls
  const fetchProjectCategories = useCallback(async () => {
    if (!user?.authToken) return;
    // setCategoriesLoading(true);
    try {
      const res = await ProjectCategoryApi.getList({ authToken: user.authToken });
      setProjectCategories(res.data?.projectCategories);
      // console.log(res.data?.badgeCategories);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    // setCategoriesLoading(false);
  }, [user.authToken]);

  // regular project pagination
  const fetchProjects = useCallback(async () => {
    if (!user?.authToken) return;
    setProjects([]);

    const requestParams = {
      authToken: user.authToken,
      limit: DEFAULT_LIMIT,
      offset: (page - 1) * DEFAULT_LIMIT,
      isPublished: true,
      verboseAttributes: ['badges'],
    };
    // if projectCategoryId is undefined, fetch all projects, else:
    if (projectCategoryId > 0) requestParams.projectCategoryId = projectCategoryId;

    // similar for searching keywords
    if (searchKeywords.length > 0) requestParams.keywords = searchKeywords;

    // filters
    if (projectFilter === ProjectFilterType.RANDOM) {
      requestParams.order = ProjectOrderType.RANDOM;
    } else {
      // default fetch the newest project
      requestParams.order = ProjectOrderType.LATEST;
      // if work in progress is requried, set isCompleted to false
      if (projectFilter === ProjectFilterType.WORK_IN_PROGRESS) {
        requestParams.isCompleted = false;
      }
    }

    setLoading(true);
    try {
      const res = await ProjectApi.getList(requestParams);
      setProjects(res.data?.projects);
      // console.log(res.data?.projects);
      setTotalPages(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user.authToken, page, projectCategoryId, searchKeywords, projectFilter]);

  useEffect(() => {
    fetchProjectCategories();
  }, [fetchProjectCategories]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setProjectFilter(ProjectFilterType.LATEST);
    setProjectCategoryId(-1);
    setSearchKeywords(searchInput);
    setPage(1);
    setSearchInput('');
  };

  const handleProjectFilterChange = (res) => {
    setProjectFilter(res);
  };

  const handleProjectCategoryChange = (id) => () => {
    setProjectCategoryId(id);
    setSearchKeywords('');
    setPage(1);
    setTotalPages(1);
  };

  return (
    <div className="projects">
      <Joyride sectionType={TutorialSectionType.PROJECTS} />
      <div className="projects-header-container">
        <div className="projects-header-title-container">
          <p className="projects-title">{t('Projects')}</p>
          <p className="title-description">{t(user?.institutionId === 1 ? 'projectDescVivita' : 'projectDescOthers')}</p>
        </div>
      </div>
      <div className="separator-container">
        <form className="search-bar-container" onSubmit={handleSearchSubmit}>
          <div className={`search-bar${searchKeywords === '' ? '' : ' active'}`}>
            <input type="text" id="project-search" name="project_search" placeholder={t('Search Projects')} onChange={(e) => setSearchInput(e.target.value)} value={searchInput} />
          </div>
          <button type="submit" className="search-button">
            <SearchSvg className="icon-search" />
          </button>
        </form>
        <div className="new-project-button-container">
          <Link className="new-project-button" to="/submit-project">
            <p className="new-project-button-text-add">+</p>
            <p className="new-project-button-text">{t('Add New Project')}</p>
          </Link>
        </div>
      </div>

      <div className="body">
        <div className="project-container">
          <p className="category-title">{t('Categories')}</p>

          <Carousel
            ssr
            responsive={responsive}
            arrows={false}
            customButtonGroup={<ButtonGroup />}
            swipeable
            draggable={false}
            // infinite
            customTransition="transform 800ms ease-in-out"
            transitionDuration={800}
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            itemClass="carousel-item"
          >
            {projectCategories.map((v) => (
              <div
                className={projectCategoryId === v.id ? 'category-label active' : 'category-label'}
                key={`category_${v.id}`}
                onClick={handleProjectCategoryChange(projectCategoryId === v.id ? -1 : v.id)}
              >
                {v.name}
              </div>
            ))}
          </Carousel>

          <div className="filters-container">
            <div className="filter-by-text">
              {t('FILTER BY')}
              :
            </div>
            <form className="filters-form">
              <select className="form-select" onChangeCapture={(e) => handleProjectFilterChange(e.target.value)}>
                <option className="form-option" value={ProjectFilterType.LATEST}>{t('Newly Created')}</option>
                <option className="form-option" value={ProjectFilterType.RANDOM}>{t('Recommended')}</option>
                <option className="form-option" value={ProjectFilterType.WORK_IN_PROGRESS}>{t('Work-in-Progress')}</option>
              </select>
            </form>
          </div>
        </div>
      </div>

      <div className="project-container">
        <div className="project-container-sub">
          {loading ? (
            <div className="loading-container">
              <Loading show={loading} size="40px" />
            </div>
          ) : (
            <ul className="project-list">
              {projects.map((v) => (
                <li key={`project_${v.id}`}>
                  <ProjectItem preloadedData={v} id={v.id} />
                </li>
              ))}
            </ul>
          )}
          <div className="projects-main-footer">
            {projectFilter === ProjectFilterType.RANDOM ? (
              <h3>{t('Please refresh to view a new set of random projects!')}</h3>
            ) : totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
