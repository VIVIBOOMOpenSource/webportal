import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './sign-up.scss';

import DobPicker from 'src/components/common/dob-picker/dob-picker';
import { ReactComponent as Back } from 'src/css/imgs/icon-arrow-back.svg';
import PasswordInput from 'src/components/common/password-input/password-input';
import Button from 'src/components/common/button/button';
import { toast } from 'react-toastify';
import { DateTime } from 'luxon';
import UserApi from 'src/apis/viviboom/UserApi';
import PublicBranchApi from 'src/apis/viviboom/PublicBranchApi';
import ViviboomLogo from '../../../../css/imgs/viviboom-logo.png';

function SignUp() {
  const history = useHistory();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [showSecondGuardianFields, setShowSecondGuardianFields] = useState(false);
  const [userEdit, setUserEdit] = useState({});

  const fetchBranches = async () => {
    try {
      const res = await PublicBranchApi.getList({ institutionId: 1 });
      const fetchedBranches = res.data?.branches.map((branch) => ({
        ...branch,
      }));
      setBranches(fetchedBranches);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // 1 => 2
  const handleProceed = (e) => {
    e.preventDefault();
    if (!userEdit?.dob) {
      toast.error('The date selected does not exist');
      return;
    }
    document.getElementById('sign-up-form').scrollIntoView({ behavior: 'smooth' });
    setPage(2);
  };

  function clearSecondGuardianFields() {
    setUserEdit({
      ...userEdit,
      guardianNameTwo: '',
      guardianRelationshipTwo: '',
      guardianEmailTwo: '',
      guardianPhoneTwo: '',
    });
  }

  function toggleSecondGuardianButton() {
    setShowSecondGuardianFields((show) => {
      if (show) clearSecondGuardianFields();
      return !show;
    });
  }

  // 2 => 3
  const onSubmitForm = useCallback(async (evt) => {
    evt.preventDefault();

    if (userEdit?.password !== userEdit.confirmPassword) {
      toast.error('Passwords Mismatched');
      return;
    }

    const requestParams = {
      username: userEdit.username,
      password: userEdit.password,
      givenName: userEdit.givenName,
      familyName: userEdit.familyName,
      gender: userEdit.gender.toUpperCase(),
      dob: DateTime.fromJSDate(userEdit.dob).toFormat('yyyy-LL-dd'),
      school: userEdit.school,
      educationLevel: userEdit.educationLevel,
      guardianName: userEdit.guardianName,
      guardianRelationship: userEdit.guardianRelationship.toUpperCase(),
      guardianEmail: userEdit.guardianEmail,
      guardianPhone: userEdit.guardianPhone,
      address: userEdit.address,
      branchId: userEdit.branchId,
    };

    if (userEdit?.email) requestParams.email = userEdit.email;
    if (userEdit?.phone) requestParams.phone = userEdit.phone;
    if (userEdit?.guardianNameTwo) requestParams.guardianNameTwo = userEdit.guardianNameTwo;
    if (userEdit?.guardianRelationshipTwo) requestParams.guardianRelationshipTwo = userEdit.guardianRelationshipTwo.toUpperCase();
    if (userEdit?.guardianPhoneTwo) requestParams.guardianPhoneTwo = userEdit.guardianPhoneTwo;
    if (userEdit?.guardianEmailTwo) requestParams.guardianEmailTwo = userEdit.guardianEmailTwo;

    setLoading(true);
    try {
      await UserApi.signUp(requestParams);
      setPage(3); // success page
      toast.success('Requested for sign-up successfully!');
      document.getElementById('sign-up-form').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      toast(err?.response?.data?.message || err.message);
    }
    setLoading(false);
  }, [userEdit]);

  const handleBack = () => {
    if (page === 2) {
      setPage(1);
    } else {
      history.goBack();
    }
  };

  useEffect(() => {
    setUserEdit({
      givenName: '',
      familyName: '',
      gender: '',
      dob: '',
      school: '',
      educationLevel: '',
      email: '',
      phone: '',
      guardianName: '',
      guardianRelationship: '',
      guardianEmail: '',
      guardianPhone: '',
      guardianNameTwo: '',
      guardianRelationshipTwo: '',
      guardianEmailTwo: '',
      guardianPhoneTwo: '',
      address: '',
      branchId: '',
      username: '',
      password: '',
    });
  }, []);

  return (
    <div className="member-signup">
      <div className="member-signup-info">
        <div className="sign-up-form" id="sign-up-form">
          {page === 1 && (
            <form onSubmit={handleProceed}>
              <div className="form-content">
                <h3 className="section-title">VIVINAUT's Particulars</h3>
                <label>
                  Vivistop Branch*
                </label>
                <select
                  className="text-input"
                  onChange={(e) => { setUserEdit({ ...userEdit, branchId: e.target.value }); }}
                  value={userEdit?.branchId}
                  disabled={loading}
                  required
                >
                  <option value="" disabled hidden>Choose here</option>
                  {branches?.map((v) => <option key={`branch-${v.id}`} value={`${v.id}`}>{v.name}</option>)}
                </select>
                <label>
                  VIVINAUT's Given Name*
                </label>
                <input
                  className="text-input"
                  type="text"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, givenName: e.target.value }); }}
                  value={userEdit?.givenName || ''}
                  required
                />

                <label>
                  VIVINAUT's Family Name*
                </label>
                <input
                  className="text-input"
                  type="text"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, familyName: e.target.value }); }}
                  value={userEdit?.familyName || ''}
                  required
                />

                <label>
                  VIVINAUT's Gender*
                </label>
                <select
                  className="text-input"
                  onChange={(e) => { setUserEdit({ ...userEdit, gender: e.target.value }); }}
                  value={userEdit?.gender?.toLowerCase()}
                  disabled={loading}
                  required
                >
                  <option value="" disabled hidden>Choose here</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="no_response">Prefer not to respond</option>
                  <option value="other">Other</option>
                </select>

                <label>
                  VIVINAUT's Date of Birth*
                </label>
                <DobPicker
                  className="dob-input"
                  defaultValue={userEdit?.dob}
                  onChange={(e) => { setUserEdit({ ...userEdit, dob: e }); }}
                />

                <label>
                  School*
                </label>
                <input
                  className="text-input"
                  type="text"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, school: e.target.value }); }}
                  value={userEdit?.school || ''}
                  required
                />

                <label>
                  VIVINAUT's Education Level*
                </label>
                <select
                  className="text-input"
                  onChange={(e) => { setUserEdit({ ...userEdit, educationLevel: e.target.value }); }}
                  value={userEdit?.educationLevel}
                  disabled={loading}
                  required
                >
                  <option value="" disabled hidden>Choose here</option>
                  <option value="primary 1">Primary 1</option>
                  <option value="primary 2">Primary 2</option>
                  <option value="primary 3">Primary 3</option>
                  <option value="primary 4">Primary 4</option>
                  <option value="primary 5">Primary 5</option>
                  <option value="primary 6">Primary 6</option>
                  <option value="secondary 1">Secondary 1</option>
                  <option value="secondary 2">Secondary 2</option>
                  <option value="secondary 3">Secondary 3</option>
                  <option value="secondary 4">Secondary 4</option>
                  <option value="secondary 5">Secondary 5</option>
                  <option value="grade 1">Grade 1</option>
                  <option value="grade 2">Grade 2</option>
                  <option value="grade 3">Grade 3</option>
                  <option value="grade 4">Grade 4</option>
                  <option value="grade 5">Grade 5</option>
                  <option value="grade 6">Grade 6</option>
                  <option value="grade 7">Grade 7</option>
                  <option value="grade 8">Grade 8</option>
                  <option value="grade 9">Grade 9</option>
                  <option value="grade 10">Grade 10</option>
                  <option value="grade 11">Grade 11</option>
                  <option value="grade 12">Grade 12</option>
                </select>

                <label>VIVINAUT's Email (optional)</label>
                <input
                  className="text-input"
                  type="text"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, email: e.target.value }); }}
                  value={userEdit?.email || ''}
                />

                <label>VIVINAUT's Phone Number (optional)</label>
                <input
                  className="text-input"
                  type="number"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, phone: e.target.value }); }}
                  value={userEdit?.phone || ''}
                />

                <h3 className="section-title">Guardian's Particulars</h3>
                <label>
                  Guardian's Full Name*
                </label>
                <input
                  className="text-input"
                  type="text"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, guardianName: e.target.value }); }}
                  value={userEdit?.guardianName || ''}
                  required
                />

                <label>
                  Relationship*
                </label>
                <select
                  className="text-input"
                  onChange={(e) => { setUserEdit({ ...userEdit, guardianRelationship: e.target.value }); }}
                  value={userEdit?.guardianRelationship}
                  disabled={loading}
                  required
                >
                  <option value="" disabled hidden>Choose here</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="parent">Parent</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="legal_guardian">Legal guardian</option>
                </select>

                <label>
                  Residential Address*
                </label>
                <input
                  className="text-input"
                  type="text"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, address: e.target.value }); }}
                  value={userEdit?.address || ''}
                  required
                />

                <label>
                  Guardian's Email*
                </label>
                <input
                  className="text-input"
                  type="email"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, guardianEmail: e.target.value }); }}
                  value={userEdit?.guardianEmail || ''}
                  required
                />

                <label>Guardian's Phone Number*</label>
                <input
                  className="text-input"
                  type="number"
                  disabled={loading}
                  onChange={(e) => { setUserEdit({ ...userEdit, guardianPhone: e.target.value }); }}
                  value={userEdit?.guardianPhone || ''}
                  required
                />

                {showSecondGuardianFields && (
                  <>
                    <h4 className="subsection-title second-guardian">Second Guardian's Particulars</h4>
                    <label>
                      Second Guardian's Full Name*
                    </label>
                    <input
                      className="text-input"
                      type="text"
                      disabled={loading}
                      onChange={(e) => { setUserEdit({ ...userEdit, guardianNameTwo: e.target.value }); }}
                      value={userEdit?.guardianNameTwo || ''}
                      required
                    />

                    <label>
                      Relationship*
                    </label>
                    <select
                      className="text-input"
                      onChange={(e) => { setUserEdit({ ...userEdit, guardianRelationshipTwo: e.target.value }); }}
                      value={userEdit?.guardianRelationshipTwo}
                      disabled={loading}
                      required
                    >
                      <option value="" disabled hidden>Choose here</option>
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="legal_guardian">Legal guardian</option>
                      <option value="parent">Parent</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="legal_guardian">Legal guardian</option>
                    </select>

                    <label>
                      Second Guardian's Email*
                    </label>
                    <input
                      className="text-input"
                      type="email"
                      disabled={loading}
                      onChange={(e) => { setUserEdit({ ...userEdit, guardianEmailTwo: e.target.value }); }}
                      value={userEdit?.guardianEmailTwo || ''}
                      required
                    />

                    <label>Second Guardian's Phone Number*</label>
                    <input
                      className="text-input"
                      type="number"
                      disabled={loading}
                      onChange={(e) => { setUserEdit({ ...userEdit, guardianPhoneTwo: e.target.value }); }}
                      value={userEdit?.guardianPhoneTwo || ''}
                      required
                    />
                  </>
                )}
                <div className="add-second-guardian" onClick={toggleSecondGuardianButton}>
                  {showSecondGuardianFields ? 'Remove Second Guardian' : 'Add Second Guardian'}
                </div>
              </div>
              <div className="button-container">
                <Button parentClassName="submit-form" type="submit" status={loading ? 'loading' : 'save'} value="Next" />
              </div>
            </form>
          )}
          {page === 2 && (
            <div>
              <div className="back-button" onClick={() => setPage(1)}>
                <Back />
              </div>
              <form onSubmit={onSubmitForm}>
                <div className="form-content">
                  <h3 className="section-title">VIVIBOOM Username and Password</h3>

                  <label>
                    Username*
                  </label>
                  <input
                    className="text-input"
                    type="text"
                    disabled={loading}
                    onChange={(e) => { setUserEdit({ ...userEdit, username: e.target.value }); }}
                    value={userEdit?.username || ''}
                    pattern=".{5,}"
                    title="5 characters minimum"
                    placeholder="At least 5 characters required"
                    required
                  />

                  <label>Password*</label>
                  <PasswordInput
                    className="text-input"
                    disabled={loading}
                    onChange={(e) => { setUserEdit({ ...userEdit, password: e.target.value }); }}
                    value={userEdit?.password || ''}
                    pattern=".{8,}"
                    title="8 characters minimum"
                    placeholder="At least 8 characters required"
                    required
                  />

                  <label>Confirm Password*</label>
                  <PasswordInput
                    className="text-input"
                    disabled={loading}
                    onChange={(e) => { setUserEdit({ ...userEdit, confirmPassword: e.target.value }); }}
                    value={userEdit?.confirmPassword || ''}
                    pattern=".{8,}"
                    title="8 characters minimum"
                    required
                  />
                </div>
                <div className="button-container">
                  <Button parentClassName="submit-form" type="submit" status={loading ? 'loading' : 'save'} value="Submit" />
                </div>
              </form>
            </div>
          )}
          {page === 3 && (
            <div className="success-page">
              <img className="logo-image" alt="logo" src={ViviboomLogo} />
              <h3 className="email-sent">
                Thank you for signing up!
              </h3>
              <p className="check-email">
                Your application is pending. You will receive an email once its approved!
              </p>
            </div>
          )}
        </div>
        <div className="back-button" onClick={handleBack}>
          <Back />
        </div>
      </div>
    </div>
  );
}

export default SignUp;
