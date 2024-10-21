import dynamic from 'next/dynamic';
import VoiceCallPage from '@views/pages/voice-call';

const VoiceCallWrapper = dynamic(() => import('@views/apps/voice-call'));

const tabContentList = (params) => ({
    'channel': <VoiceCallWrapper folder={params?.folder || 'default-folder'} />
});

const VoiceCallFolderPage = ({ params }) => {
    return <VoiceCallPage tabContentList={tabContentList(params || { folder: 'default-folder' })} />;
}

export default VoiceCallFolderPage;

