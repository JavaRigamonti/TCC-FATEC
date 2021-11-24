import {getLocalStorage} from './localStorage';

export const isOwner = () => {
  const user = getLocalStorage("@Flush:user");
  
  if(!user.is_owner){
    return false;
  }

  return true;
};
