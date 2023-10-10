import LayoutFront from 'layout/LayoutFront/LayoutFront';
import Dashboard from 'view/Front/Dashboard/Dashboard';
import CardSDGAll from 'view/Front/HomeBanner/CardSDG/CardSDGAll';
import HomeTable from 'view/Front/HomeBanner/HomeTable';
import MyProject from 'view/Front/MyProject/MyProject';
import SDG_List from 'view/Front/HomeBanner/SDG/SDG_List';
import WorkFlowTest from 'view/Front/MyProject/WorkFlowTest';
import MyProjectList from 'view/Front/MyProject/MyProjectList';
import LoginCenter from 'view/Authen/LoginCenter';
import { Project } from 'view/Front/Projects/Project';
import PageGraph from 'view/Front/Graph/PageGraph';
import ProjectUpdate from 'view/Front/Projects/ProjectUpdate';
import ProjectReport from 'view/Front/Projects/ProjectReport';
import PageUserGroup from 'view/Authen/PageUserGroup';
import MigrationData from 'view/Front/MigrationData/MigrationData';

const route = [
    
    {
        exact: true,
        path: "/",
        component: LoginCenter,
    },
    {
        exact: true,
        path: "/select-group",
        component: PageUserGroup,
    },
    {
        exact: true,
        path: "/search",
        component: Dashboard,
        layout: LayoutFront,
    },
    {
        exact: true,
        path: "/page-myproject",
        component: MyProject,
        layout: LayoutFront,
    },
    {
        exact: true,
        path: "/homebanner",
        component: HomeTable,
        layout: LayoutFront,
    },
    {
        path: "/project-request",
        component: Project,
        layout: LayoutFront,
    },
    {
        path: "/project-report",
        component: ProjectReport,
        layout: LayoutFront,
    },
    {
        path: "/project-update",
        component: ProjectUpdate,
        layout: LayoutFront,
    },
    {
        exact: true,
        path: "/project-approve",
        component: Project,
        layout: LayoutFront,
    },
    {
        path: "/homebanner-sdg-list",
        component: SDG_List,
        layout: LayoutFront,
    },
    {
        exact: true,
        path: "/homebanner-card-sdg-all",
        component: CardSDGAll,
        layout: LayoutFront,
    },
    {
        exact: true,
        path: "/WorkFlow",
        component: WorkFlowTest,
        layout: LayoutFront,
    },
    {
        path: "/project",
        component: MyProjectList,
        layout: LayoutFront,
    },
    {
        path: "/pagegraph",
        component: PageGraph,
        layout: LayoutFront,
    },
    {
        path: "/migration-data",
        component: MigrationData,
        layout: LayoutFront,
    },


]
export default route;