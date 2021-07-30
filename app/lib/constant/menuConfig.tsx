import React from "react";
import {
  DashboardOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  ProjectOutlined,
  FileAddOutlined,
  EditOutlined,
  MessageOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Role } from "../../model/role";
import { RoleEnum } from "./roleEnum";


export interface MenuItem {
  label: string;
  key?: string;
  icon?: React.ReactNode;
  path: string;
  subMenu: MenuItem[] | null;
}

const overview: MenuItem = {
  label: 'Overview',
  path: '',
  icon: <DashboardOutlined />,
  subMenu: null
}

const students: MenuItem = {
  label: 'Student',
  path: '/students',
  icon: <SolutionOutlined />,
  subMenu: [
    {
      label: 'Student List',
      path: '',
      icon: <TeamOutlined />,
      subMenu: null
    }
  ]
}

const courses: MenuItem = {
  label: 'Course',
  path: '/courses',
  icon: <ReadOutlined />,
  subMenu: [
    {
      label: 'All Courses',
      path: '',
      icon: <ProjectOutlined />,
      subMenu: null
    },
    {
      label: 'Add Course',
      path: '/add-course',
      icon: <FileAddOutlined />,
      subMenu: null
    },
    {
      label: 'Edit Course',
      path: '/edit-course',
      icon: <EditOutlined />,
      subMenu: null
    },
  ]
}

const teachers: MenuItem = {
  label: 'Teacher',
  path: '/teachers',
  icon: <DeploymentUnitOutlined />,
  subMenu: [
    {
      label: 'Teacher List',
      path: '',
      icon: <TeamOutlined />,
      subMenu: null
    }
  ]
}

const messages: MenuItem = {
  label: 'Message',
  path: '/message',
  icon: <MessageOutlined />,
  subMenu: null
}

const classSchedule: MenuItem = {
  label: 'Class Schedule',
  path: '/schedule',
  icon: <CalendarOutlined />,
  subMenu: null
}

const studentCourses: MenuItem = {
  label: 'Course',
  path: '/courses',
  icon: <ReadOutlined />,
  subMenu: [
    {
      label: 'All Courses',
      path: '',
      icon: <ProjectOutlined />,
      subMenu: null
    },
    {
      label: 'My Courses',
      path: '/own',
      icon: <FileAddOutlined />,
      subMenu: null
    }
  ]
}

const rawMenus: Map<Role, MenuItem[]> = new Map([
  [RoleEnum.manager, [overview, students, teachers, courses, messages]],
  [RoleEnum.teacher, [overview, classSchedule, students, courses, messages]],
  [RoleEnum.student, [overview, studentCourses, classSchedule, messages]],
])

function addPathPrefixAndKey(menuItems: MenuItem[], prefix: string): MenuItem[] {
  let result: MenuItem[] = [];
  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].subMenu !== null) {
      let newPrefix = prefix + menuItems[i].path;
      let newMenuItem: MenuItem = {
        ...menuItems[i],
        path: '',
        key: menuItems[i].label + '_' + i,
        subMenu: addPathPrefixAndKey(menuItems[i].subMenu!, newPrefix)
      };
      addPathPrefixAndKey(menuItems[i].subMenu!, newMenuItem.path);
      result.push(newMenuItem);
    } else {
      let newMenuItem: MenuItem = {
        ...menuItems[i],
        path: prefix + menuItems[i].path,
        key: menuItems[i].label + '_' + i,
      };
      result.push(newMenuItem);
    }
  }
  return result;
}

/**
 * 判断当前路径是否指向一个详情页
 */
 const isDetailPath = (path: string): boolean => {
  const paths = path.split('/');
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

/**
 * 忽略详情路径上的参数路径
 */
const omitDetailPath = (path: string): string => {
  const isDetail = isDetailPath(path);

  return isDetail ? path.slice(0, path.lastIndexOf('/')) : path;
};

function getActiveKey(menuItems: MenuItem[], path: string, record: string[]): [MenuItem | null, string[]]{
  for(let menuItem of menuItems) {
    record.push(menuItem.key!);
    if(menuItem.path === path) {
      return [menuItem, record];
    } else if(menuItem.subMenu !== null) {
      let [resMenuItem, resRecord] = getActiveKey(menuItem.subMenu, path, record);
      if(resMenuItem !== null) {
        return [resMenuItem, resRecord];
      }
      record.pop();
    } else {
      record.pop();
    }
  }
  return [null, []];
}

export function getMenusByRole(role: string): MenuItem[] {
  let generatedMenus = addPathPrefixAndKey(rawMenus.get(role as Role)!, '/dashboard/' + role);
  return generatedMenus;
}

export function getDefaultKeys(generatedMenus: MenuItem[], path: string): 
  {defaultSelectedKeys: string, defaultOpenKeys: string} {
  const [activeMenuItem, activeRoute] = getActiveKey(generatedMenus, omitDetailPath(path),[]);
  const defaultSelectedKeys = activeMenuItem?.key || '';
  const defaultOpenKeys = activeRoute.length > 1 ? activeRoute[activeRoute.length - 2] : activeRoute[0];
  return {defaultSelectedKeys, defaultOpenKeys};
}

function getActiveMenuItems(menuItems: MenuItem[], path: string, record: MenuItem[]): MenuItem[] {
  for(let menuItem of menuItems) {
    record.push(menuItem);
    if(menuItem.path === path) {
      return record;
    } else if(menuItem.subMenu !== null) {
      let resultRecord = getActiveMenuItems(menuItem.subMenu, path, record);
      if(resultRecord.length > 0) {
        return resultRecord;
      }
    }
    record.pop();
  }
  return [];
}

export function getBreadcrumbs(generatedMenus: MenuItem[], path: string): MenuItem[] {
  let activeMenuItems= getActiveMenuItems(generatedMenus, omitDetailPath(path), []);
  if(isDetailPath(path)) {
    activeMenuItems.push(
      {
        label: 'Detail',
        path: '',
        subMenu: null,
      }
    )
  } else {
    // 面包屑最后一个不需要添加link
    activeMenuItems[activeMenuItems.length - 1].path = '';
  }
  return activeMenuItems;
}