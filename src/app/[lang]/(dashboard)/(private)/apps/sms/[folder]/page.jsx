import dynamic from 'next/dynamic';
import SMSPage from '@views/pages/sms';

const SMSWrapper = dynamic(() => import('@views/apps/sms'));

const tabContentList = (params) => ({
    'channel': <SMSWrapper folder={params?.folder || 'default-folder'} />
});

const SmsFolderPage = ({ params }) => {
    return <SMSPage tabContentList={tabContentList(params || { folder: 'default-folder' })} />;
}

export default SmsFolderPage;

