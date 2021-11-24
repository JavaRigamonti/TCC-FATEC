import {getLocalStorage} from './localStorage';

export const isAuth = () => {
  const token = getLocalStorage("@Flush:token");

  if(!token){
    return false;
  }

  return true;
}
