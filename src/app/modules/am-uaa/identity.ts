import * as _ from 'lodash';

export class Identity {
  email: string;
  firstName: string;
  fullName: string;
  initials: string;
  lastName: string;
  roles: any[];
  delegatedRoles: any[];
  user_name: string;

  constructor(tokenIdentity: any) {
    this.email = tokenIdentity.email;
    this.firstName = tokenIdentity.firstName;
    this.fullName = tokenIdentity.fullName;
    this.initials = tokenIdentity.initials;
    this.lastName = tokenIdentity.lastName;
    this.roles = tokenIdentity.roles;
    this.user_name = tokenIdentity.user_name;
    this.delegatedRoles = tokenIdentity.delegatedRoles;
  }

  hasRole(roleName: string) {
    let contains = false;
    if (this.roles && this.roles.length > 0) {
      this.roles.forEach(role => {
        if (role.name === roleName) {
          contains = true;
        }
      });
    }
    if (this.delegatedRoles && this.delegatedRoles.length > 0) {
      this.delegatedRoles.forEach(role => {
        if (role.name === roleName) {
          contains = true;
        }
      });
    }
    return contains;
  }

  hasRoles(roleNames: string[]) {
    let roles = [];
    if (this.roles && this.roles.length > 0) {
      roles = _.map(this.roles, 'name');
    }
    if (this.delegatedRoles && this.delegatedRoles.length > 0) {
      const delegateRoles = _.map(this.delegatedRoles, 'name');
      roles = _.union(roles, delegateRoles);
    }

    const intersect = _.intersection(roles, roleNames);
    return intersect.length === roleNames.length;
  }

  hasAnyRole(roleNames: string[]) {
    let roles = [];
    if (this.roles && this.roles.length > 0) {
      roles = _.map(this.roles, 'name');
    }
    if (this.delegatedRoles && this.delegatedRoles.length > 0) {
      const delegatedRoles = _.map(this.delegatedRoles, 'name');
      roles = _.union(roles, delegatedRoles);
    }

    const intersect = _.intersection(roles, roleNames);
    return intersect.length > 0;
  }


}
