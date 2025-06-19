import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const usePostEditor = (initialPost = null, onSave = () => { }) => {
    const [caption, setCaption] = useState(initialPost?.caption || '');
    const [hashtags, setHashtags] = useState(initialPost?.hashtags?.join(' ') || '');
    const [previewUrl, setPreviewUrl] = useState(initialPost?.imageUrl || null);
    const [mediaType, setMediaType] = useState(initialPost?.mediaType || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setMediaType(file.type.startsWith('video') ? 'video' : 'image');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const postData = {
            id: initialPost?.id || uuidv4(),
            user: localStorage.getItem('user'),
            caption,
            hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
            imageUrl: previewUrl,
            mediaType,
            createdAt: new Date().toISOString(),
            likes: initialPost?.likes || 0,
            comments: initialPost?.comments || [],
            commentCount: initialPost?.comments?.length || 0,
        };

        onSave(postData);
    };

    return {
        caption,
        setCaption,
        hashtags,
        setHashtags,
        previewUrl,
        mediaType,
        handleFileChange,
        handleSubmit,
    };
};

export default usePostEditor;