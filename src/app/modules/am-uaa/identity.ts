import * as _ from 'lodash';

export class Identity {
  email: string;
  firstName: string;
  fullName: string;
  initials: string;
  lastName: string;
  roles: any[];
  user_name: string;

  constructor(tokenIdentity: any) {
    this.email = tokenIdentity.email;
    this.firstName = tokenIdentity.firstName;
    this.fullName = tokenIdentity.fullName;
    this.initials = tokenIdentity.initials;
    this.lastName = tokenIdentity.lastName;
    this.roles = tokenIdentity.roles;
    this.user_name = tokenIdentity.user_name;
  }

  hasRole(roleName: string) {
    let contains = false;
    this.roles.forEach(role => {
      if (role.name === roleName) {
        contains = true;
      }
    });
    return contains;
  }

  hasRoles(roleNames: string[]) {
    const roles = _.map(this.roles, 'name');
    const intersect = _.intersection(roles, roleNames);

    return intersect.length === roleNames.length;
  }

  hasAnyRole(roleNames: string[]) {
    const roles = _.map(this.roles, 'name');
    const intersect = _.intersection(roles, roleNames);

    return intersect.length > 0;
  }


}
