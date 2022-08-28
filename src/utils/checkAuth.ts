const isAuth = (status: number) => {
  return status !== 401 && status !== 402;
};

export default isAuth;
