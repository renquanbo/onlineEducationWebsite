import { Breadcrumb } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { pathBreadcrumbPair } from "../../app/lib/constant/breadcrumbConfig";
import { MenuItem } from "../../app/lib/constant/menuConfig";

interface Breadcrumbs {
    breadcrumbs: MenuItem[]
}

export default function AppBreadCrumb(props: Breadcrumbs) {
    const router = useRouter();
    const path = router.pathname;
    const role = path.split('/')[2];
    // const breadcrumbs = pathBreadcrumbPair[path].breadcrumbs;

    return(
        <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
            <Breadcrumb.Item key={'CMS SYSTEM'}>
                <Link href={"/dashboard/" + role}>{'CMS ' + role.toUpperCase() + ' SYSTEM'}</Link>
                {/* CMS {role.toUpperCase} SYSTEM */}
            </Breadcrumb.Item>
            {props.breadcrumbs.map((item, index)=>(
                <Breadcrumb.Item key={index}>
                    {item.path === '' ? item.label : <Link href={item.path}>{item.label}</Link>} 
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    )
}