import React,{useState,useEffect,useRef} from 'react';
import useUserState from '../../../store/user';
import Button from '../../common/button/button';
import PasswordInput from '../../common/password-input/password-input';
import Modal from '../../common/modal/modal';
import {request,unSubRequest} from '../../../utils/request';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import {useTranslation} from 'react-i18next';

const DeleteAccountModal = ({show,handleClose}) => {

  const {logoutUser} = useUserState();
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [status,setStatus] = useState("");
  const passwordInputRef = useRef(null);
  const [logoutRequest,setLogoutRequest] = useState(false);

  const {t} = useTranslation();

  useEffect(() => {
    return () => {
      unSubRequest("user-delete");
    }
  },[]);

  useEffect(() => {
    setStatus((loading) ? "loading" :"delete")
  },[loading]);

  useEffect(() => {
    if(logoutRequest){
      logoutUser();
    }
  },[logoutRequest,logoutUser]);

  const formHandler = (e) => {
    e.preventDefault();

    deleteAccountRequest(username,email,password);
  }

  const deleteAccountRequest = (username,email,password) => {

    const data = {
      username: username,
      email: email,
      password: password,
    };

    setLoading(true);
    request("user-delete","/user","DELETE", data, {
      then: function(res){
        var message = "Success! We're sorry to see you go, however your account has been completely deleted. ";
        toast.success(message);
        handleModalClose();
        setLogoutRequest(true);
      },
      catch: function(err){
        toast.error(err.message);
      },
      finally: function(){
        setLoading(false);
      }
    });

  }

  const handleModalClose = () => {
    // do other stuff 
    setUsername("");
    setEmail("");
    setPassword("");
    handleClose()
  }

  return (
    <Modal className="delete-account-modal" show={show} handleClose={() => {handleModalClose()}}>
      <div className="change-info">
        <form onSubmit={formHandler}>
          <h3>{t('myAccount.deleteAccount')}</h3>
          <p>{t('myAccount.deleteAccountText')}</p>

          <label>{t('myAccount.username')}</label>
          <input 
            type={"text"}
            placeholder={t('myAccount.username')}
            disabled={loading}
            onChange={(e) => {setUsername(e.target.value);}}
            value={username} />

          <label>{t('myAccount.email')}</label>
          <input 
            type={"email"}
            placeholder={t('myAccount.email')}
            disabled={loading}
            onChange={(e) => {setEmail(e.target.value);}}
            value={email} />

          <label>{t('myAccount.password')}<span className="forgot-password"><Link tabIndex="-1" to="/reset-password">{t('myAccount.forgotPassword')}</Link></span></label>
          <PasswordInput 
            onChange={(e) => {setPassword(e.target.value);}}
            disabled={loading}
            value={password} 
            placeholder={t('myAccount.password')}
            passRef={passwordInputRef} />
          
          <Button type="submit" parentClassName="delete" status={status} value={t('myAccount.deleteAccountForever')} />
        </form>
      </div>
    </Modal>
  );

};

export default DeleteAccountModal;