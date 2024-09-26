import React from 'react';
import {
  Router, Route, Switch, withRouter,
} from 'react-router-dom';
import { ToastContainer, Flip } from 'react-toastify';

import './css/styles/app.scss';
import './css/styles/common.scss';

import history from './store/history';

import Navi from './components/navi/navi';
import NaviMobile from './components/navi/navi-mobile';
import NaviGrayOutScreen from './components/navi/navi-gray-out-screen';
import Footer from './components/footer/footer';
import Home from './components/views/home/home';
import Welcome from './components/views/welcome/welcome';
import WelcomeSignUp from './components/views/welcome/welcome-sign-up';
import MemberSignUp from './components/views/welcome/member-sign-up';
import InstitutionSignUp from './components/views/entry/sign/institution-sign-up';
import NotFound from './components/views/not-found/not-found';

import Badge from './components/views/badges/badge';
import Badges from './components/views/badges/badges';
import Challenge from './components/views/challenges/challenge';
import Challenges from './components/views/challenges/challenges';
import Booking from './components/views/booking/booking';
import MyBookings from './components/views/booking/my-bookings';
import Projects from './components/views/projects/projects';
import Chat from './components/views/chat/chat';
import Notifications from './components/views/notifications/notifications';
import SubmitProject from './components/views/projects/submit-project';
import SubmitSection from './components/views/projects/submit-section';
import EditorView from './components/views/editor-view/editor-view';

import WorkInProgress from './components/views/projects/work-in-progress';
import Member from './components/views/members/member';
import Members from './components/views/members/members';
import BoomIslandInfo from './components/views/boomisland/boomisland-info';
import PublicEvents from './components/views/booking/public/public-booking';
import PublicEvent from './components/views/booking/public/public-event';
import PublicCancel from './components/views/booking/public/public-cancel';
import PublicChallenge from './components/views/my-account/public-portfolio/challenge-details';

import HappyBirthdayRachel from './components/views/others/HappyBirthdayRachel';

import EditProfile from './components/views/my-account/edit-profile';
import EditPortfolio from './components/views/my-account/public-portfolio/edit-portfolio';
import ViewPortfolio from './components/views/my-account/public-portfolio/view-portfolio';
import PublicProject from './components/views/my-account/public-portfolio/project-details';
import Portfolio from './components/views/page/portfolio';

import Wallet from './components/views/rewards/wallet';
import ClaimReward from './components/views/rewards/claim-reward';
import RewardResults from './components/views/rewards/reward-results';

import BuilderPalChat from './components/views/builder-pal/builder-pal-chat';
import BuilderPalChallenges from './components/views/builder-pal/builder-pal-challenges';
import BuilderPalHome from './components/views/builder-pal/builder-pal-home';
import BuilderPalProject from './components/views/builder-pal/builder-pal-project';
import BuilderPalProjects from './components/views/builder-pal/builder-pal-projects';
import BuilderPalRelatedProjects from './components/views/builder-pal/builder-pal-related-projects';

import ResetPassword from './components/views/email-related/reset-password/reset-password';
import VerifyEmail from './components/views/email-related/verify-email/verify-email';

import PrivacyPolicy from './components/views/legal/privacy-policy/privacy-policy';
import TermsOfUse from './components/views/legal/terms-of-use/terms-of-use';

import AuthRoute from './components/common/routes/auth-route';
import ScrollToTop from './components/common/routes/scroll-to-top';

import 'react-toastify/dist/ReactToastify.css';

import { useChatClient } from './hooks/useChatClient';
import { ChatContext } from './components/views/chat/context/ChatContext';

const NaviDiv = withRouter(({ location }) => {
  if (
    location.pathname.includes('/welcome')
    || location.pathname.includes('/sign-up')
    || location.pathname.includes('/legal')
    || location.pathname.includes('/reset-password')
  ) {
    return <div />;
  }

  return (
    <div className={window.isRNWebView ? 'navi-container hide-in-app' : 'navi-container'}>
      <Navi />
      <NaviMobile />
      <NaviGrayOutScreen />
    </div>
  );
});

const FooterDiv = withRouter(({ location }) => {
  if (
    location.pathname.includes('/welcome')
    || location.pathname.includes('/sign-up')
    || location.pathname.includes('/reset-password')
  ) {
    return <div />;
  }
  return <Footer />;
});

function AppRouter() {
  return (
    <Router history={history}>
      <ScrollToTop />
      <div className="app">
        <NaviDiv />
        <div id="content-container">
          <div id="content">
            <Switch>
              <Route path="/welcome" component={Welcome} />
              <Route exact path="/sign-up" component={WelcomeSignUp} />
              <Route path="/sign-up/member" component={MemberSignUp} />
              <Route exact path="/sign-up/institution" component={InstitutionSignUp} />

              <Route exact path="/reset-password" component={ResetPassword} />
              <Route path="/reset-password/:token" component={ResetPassword} />

              <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
              <Route path="/legal/terms-of-use" component={TermsOfUse} />

              <Route path="/verify-email/:token" component={VerifyEmail} />
              <AuthRoute exact path="/verify-email" component={VerifyEmail} />

              <AuthRoute exact path="/" component={Home} />
              <AuthRoute path="/badge/:id" component={Badge} />
              <AuthRoute path="/badges" component={Badges} />
              <AuthRoute path="/challenge/:id" component={Challenge} />
              <AuthRoute path="/challenges" component={Challenges} />
              <AuthRoute path="/projects" component={Projects} />
              <AuthRoute path="/chat" component={Chat} />
              <AuthRoute path="/notifications" component={Notifications} />
              <AuthRoute exact path="/submit-project" component={SubmitProject} />
              <AuthRoute exact path="/edit-project/:projectId" component={SubmitProject} />
              <AuthRoute path="/project/:id" component={WorkInProgress} />
              <AuthRoute path="/edit-project/:projectId/section/:sectionId" component={SubmitSection} />
              <AuthRoute path="/submit-project/:projectId/section" component={SubmitSection} />
              <AuthRoute path="/editor" component={EditorView} />
              <AuthRoute path="/members" component={Members} />
              {/* The Booking component corresponds to Events in the path and backend. This is a naming issue when migrating from V1 to V2 */}
              <AuthRoute path="/events" component={Booking} />
              {/* To be changed to path for user booking ticket. Pointing to Events for now */}
              <AuthRoute path="/booking" component={Booking} exact="true" />
              <AuthRoute path="/my-bookings" component={MyBookings} />
              <AuthRoute exact path="/member/:id" component={Member} />
              <AuthRoute path="/edit-profile" component={EditProfile} />
              <AuthRoute path="/edit-portfolio" component={EditPortfolio} />
              <Route path="/view-portfolio/:userId/project/:projectId" component={PublicProject} />
              <Route path="/view-portfolio/:portfolioCode/challenge/:challengeId" component={PublicChallenge} exact />
              <Route path="/view-portfolio/:id" component={ViewPortfolio} />
              <Route path="/page/:code" component={Portfolio} exact />
              <Route path="/page/:portfolioCode/project/:projectId" component={PublicProject} exact />
              <Route path="/page/:portfolioCode/challenge/:challengeId" component={PublicChallenge} exact />

              <AuthRoute path="/wallet" component={Wallet} exact />
              <AuthRoute path="/reward" component={ClaimReward} exact />
              <AuthRoute path="/reward/:rewardCode" component={RewardResults} exact />
              <AuthRoute path="/builderpal" component={BuilderPalChat} exact />
              <AuthRoute path="/builderpal/home" component={BuilderPalHome} exact />
              <AuthRoute path="/builderpal/:id" component={BuilderPalChat} exact />
              <AuthRoute path="/builderpal/:id/projects" component={BuilderPalProjects} exact />
              <AuthRoute path="/builderpal/:chatId/project/:chatProjectId" component={BuilderPalProject} exact />
              <AuthRoute path="/builderpal/:id/challenges" component={BuilderPalChallenges} exact />
              <AuthRoute path="/builderpal/:id/related-projects" component={BuilderPalRelatedProjects} exact />

              <AuthRoute path="/boomisland" component={BoomIslandInfo} />

              <Route path="/branch/:code/event/:eventId" component={PublicEvent} />
              <Route path="/branch/:code/event" component={PublicEvents} />
              <Route path="/booking/public/:bookingToken" component={PublicCancel} />

              <Route path="/happy/birthday/Rachel" exact component={HappyBirthdayRachel} />

              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
        <FooterDiv />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          transition={Flip}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

function App() {
  const chatContextValue = useChatClient();

  return (
    <ChatContext.Provider value={chatContextValue}>
      <AppRouter />
    </ChatContext.Provider>
  );
}

export default App;
