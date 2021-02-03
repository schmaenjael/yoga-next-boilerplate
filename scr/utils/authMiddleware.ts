const isAuthenticated = async (
  resolve: any,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.session || !context.session.userId) {
    return null;
    /*
    [
      {
        severity: severity.error,
        titel: alertTitel.error,
        path: 'user',
        message: user.unauthenticated,
      },
    ];
    */
  }
  return resolve(parent, args, context, info);
};
/*
const isAdmin = async (
  resolve: any,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.session || !context.session.userId) {
    return null;
    
    [
      {
        severity: severity.error,
        titel: alertTitel.error,
        path: 'user',
        message: user.unauthenticated,
      },
    ];
    
  }
  // find user in database with context.session.userId
  // if(!user.admin) {return error or null}
  return resolve(parent, args, context, info);
};
*/

export const authMiddleware = {
  Query: { me: isAuthenticated },
};
