import { isUndefinedOrNull } from "../utils/typeGuard";

export interface IOrgs {
    [key: string]: string;    // org uid -> org name
}
export enum UserTypeId {
    Administrator,
    Dashboard,
}
export interface IUserInfo {
    admin: boolean;
    email: string;
    name: string;
    userName: string;
    orgs: IOrgs,
    uid: string;
    type: UserTypeId;
    orgUid?: string;
}

export type IUserInfoType = null | undefined | IUserInfo;

export interface IUsersMap {
    [key: string]: IUserInfo;
}

export const getOrgsFromUser = (user: IUserInfo): IOrgs => {
    const orgs: IOrgs = user.orgs !== undefined ? user.orgs : {};
    return orgs;
};

export const getOrgUidFromUser = (user: IUserInfo | undefined | null): string | undefined => {
    if (user) {
        if (user.admin === true) {
            return user.uid;
        }
        if (user.type === UserTypeId.Dashboard) {
            return user.uid;
        }
        else {
            const orgUids = Object.keys(getOrgsFromUser(user)).filter((uid) => uid !== user.uid);
            if (orgUids.length === 1) {
                return orgUids[0];
            }
        }
    }

    return undefined;
};

export const getUserName = (userInfo: IUserInfoType): string => {
    if (!isUndefinedOrNull(userInfo)) {
        return userInfo.type === UserTypeId.Dashboard ? `Admin ${userInfo.name}` : userInfo.name;
    }
    return ``;
};
