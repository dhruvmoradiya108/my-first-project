import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const localData = localStorage.getItem('loggedSeller');

  if(localData){
    return true
  } else {
    return false;
  }
};
