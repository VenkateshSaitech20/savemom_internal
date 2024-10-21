'use client';
import { useEffect, useCallback, useState } from 'react';
import apiClient from '@/utils/apiClient';
import { getLocalizedUrl } from '@/utils/i18n';
import { useParams, useRouter } from 'next/navigation';

const GetMenuPath = () => {
    const [doesPathExist, setDoesPathExist] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const router = useRouter();
    const { lang: locale } = useParams();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pathname = window.location.pathname.split('/').slice(2).join('/');
            setCurrentPath(`/${pathname}`);
        }
    }, []);
    const fetchMenuPaths = useCallback(async () => {
        const response = await apiClient.post('/api/menu/get-menu-path', {});
        if (response.data.result === true) {
            const menus = response.data.message;
            const paths = menus.map(menu => menu.path);
            let doesPathExistInUrl = paths.includes(currentPath);
            setDoesPathExist(doesPathExistInUrl);
        }
        if (!doesPathExist) {
            router.push(getLocalizedUrl('/dashboards', locale));
        }
    }, [currentPath, doesPathExist, locale, router]);
    useEffect(() => {
        fetchMenuPaths();
    }, [fetchMenuPaths]);
    return { doesPathExist };
};

export default GetMenuPath;
