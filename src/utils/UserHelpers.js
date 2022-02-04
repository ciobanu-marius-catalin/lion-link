class UserHelpers
{
    static adminUserType = 'admin';
    static systemAdministrator = 'System Administrator';
    static dealershipAdmin = 'Administrator';
    static dealershipManager = 'Manager';
    static dealershipEmployee = 'Employee';
    static getUserType(user)
    {
        if( user.accountType === UserHelpers.adminUserType) {
            return UserHelpers.systemAdministrator;
        }
        if(user._dealershipUser.isAdmin) {
            return UserHelpers.dealershipAdmin;
        }
        if(user._dealershipUser.isManager) {
            return UserHelpers.dealershipManager
        }
        return UserHelpers.dealershipEmployee;
    }
}

export default UserHelpers;
