import Iconify from "./Iconify";

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


const sidebarConfig = [
  // {
  //   title: "Certificates",
  //   path: "/dashboard/templates",
  //   icon: getIcon("eos-icons:templates-outlined"),
  // },
  {
    title: "Badges",
    path: "/dashboard/badges",
    icon: getIcon("mdi:police-badge-outline"),
  },
  {
    title: "Certificates",
    path: "/dashboard/certificates",
    icon: getIcon("material-symbols:collections-bookmark-outline"),
  },
  // {
  //   title: "test",
  //   path: "/dashboard/test",
  //   icon: getIcon("material-symbols:collections-bookmark-outline"),
  // },
  // {
  //   title: "preview",
  //   path: "/dashboard/preview",
  //   icon: getIcon("emojione-v1:page-with-curl"),
  // },
];

export default sidebarConfig;
