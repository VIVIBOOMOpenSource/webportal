import { React, useState, useEffect } from 'react';
import './navi-branch-modal.scss';
import Modal from 'src/components/common/modal/modal';
import { useHistory } from 'react-router-dom';
import i18n from 'src/translations/i18n';
import PublicBranchApi from 'src/apis/viviboom/PublicBranchApi';
import { CountryFlagType, getCountryFlag } from 'src/utils/countries';

function NaviBranchModal({ institutionId, show, handleClose }) {
  const [branches, setBranches] = useState([]);
  const history = useHistory();

  const handleBranchClick = (branchId) => () => {
    history.push(`/branch/${branchId}/event`);
    handleClose();
  };

  const fetchBranches = async () => {
    if (!institutionId) return;
    try {
      const res = await PublicBranchApi.getList({ institutionId, allowEventBooking: true });
      const fetchedBranches = res.data?.branches.map((branch) => ({
        ...branch,
        countryFlag: getCountryFlag(branch?.countryISO, CountryFlagType.EMOJI),
      }));
      setBranches(fetchedBranches);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [institutionId]);

  return (
    <Modal className="navi-branch-modal" show={show} handleClose={handleClose}>
      <div>
        <h2>{i18n.t('Choose Branch')}</h2>
        <ul className="available-branches-list">
          {branches.map((v) => (
            <li key={`branch-${v.id}`} onClick={handleBranchClick(v.id)}>
              {`${v.name} ${v.countryFlag}`}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

export default NaviBranchModal;
