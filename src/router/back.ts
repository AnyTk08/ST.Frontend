import HomeStandard from 'view/Back/DataStandard/HomeStandard';
import AdminBanner from 'view/Back/AdminBanner/AdminBanner';
import AdminBannerForm from 'view/Back/AdminBanner/AdminBannerForm';
import AdminGroupPermission from 'view/Back/AdminGroupPermission/AdminGroupPermission';
import AdminGroupPermissionForm from 'view/Back/AdminGroupPermission/AdminGroupPermissionForm';
import BasicInformationForm from 'view/Back/DataStandard/BasicInformationForm';
import IndicatorForm from 'view/Back/DataStandard/IndicatorForm';
import OccupationFrom from 'view/Back/DataStandard/OccupationFrom';
import SDGFrom from 'view/Back/DataStandard/SDGFrom';
import CollectForm from 'view/Back/DataStandard/CollectForm';
import AdminUserRolePermission from 'view/Back/AdminUserRolePermission/AdminUserRolePermission';
import AdminUserRolePermissionForm from 'view/Back/AdminUserRolePermission/AdminUserRolePermissionForm';
import Monitoring from 'view/Back/Mornitoring/Monitoring';
import AdminUserList from 'view/Back/AdminUser/AdminUserList';
import AdminUserForm from 'view/Back/AdminUser/AdminUserForm';
import LayoutBack2 from 'layout/LayoutBack2/LayoutBack2';
import MapShowAll from 'view/Map/MapShowAll';
const route = [
    {
        exact: true,
        path: "/admin-standard",
        component: HomeStandard,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-banner",
        component: AdminBanner,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/map",
        component: MapShowAll,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/back-sub",
        component: HomeStandard,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-bannerform",
        component: AdminBannerForm,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-roleuser",
        component: AdminUserRolePermission,
        layout: LayoutBack2,
    },
    {
        path: "/admin-standardform",
        component: BasicInformationForm,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-roleuserform",
        component: AdminUserRolePermissionForm,
        layout: LayoutBack2,
    },
    {
        path: "/admin-standardcollectform",
        component: CollectForm,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-group",
        component: AdminGroupPermission,
        layout: LayoutBack2,
    },
    {
        path: "/admin-standardindicatorform",
        component: IndicatorForm,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-groupform",
        component: AdminGroupPermissionForm,
        layout: LayoutBack2,
    },
    {
        path: "/admin-standardoccupationfrom",
        component: OccupationFrom,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-standardsdgfrom",
        component: SDGFrom,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-user-form",
        component: AdminUserForm,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-user",
        component: AdminUserList,
        layout: LayoutBack2,
    },
    {
        exact: true,
        path: "/admin-monitoring",
        component: Monitoring,
        layout: LayoutBack2,
    },
]
export default route;