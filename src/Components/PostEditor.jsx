import { useState } from "react";
import { v4 as uuidv4 } from "uuid";


const PostEditor = ({ onSave = () => {},
    initialPost = null, 
    onCancel = () => {}
    }) => {
    const[caption, setCaption] = useState(initialPost?.caption || '');
    const[hashtags, setHashtags] = useState(initialPost?.hashtags?.join('') || '');
    const[previewUrl, setPreviewUrl] = useState(initialPost?.imageUrl || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setPreviewUrl(URL.createObjectURL(file))
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const postData = {
            id: initialPost?.id || uuidv4(),
            user: localStorage.getItem('user'),
            caption,
            hashtags: hashtags.split(' ').filter(tag =>tag.startsWith('#')),
            imageUrl: previewUrl,
            createdAt: new Date().toISOString(),
            likes: initialPost?.likes || 0,
            comments: initialPost?.comments || [],
            commentCount: initialPost?.comments?.length || 0,
        };

        onSave(postData);
    };

    return (
        <div className="post-editor">
            <h2>{initialPost ? "Редактировать пост" : "Новый пост"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Контент:</label>
                    <label className="file-button">
                        <input 
                            type="file" 
                            accept="image/*, video/*"
                            onChange={handleFileChange}
                            required={initialPost}
                            className="file-upload"
                        />
                    </label>
                    {previewUrl && (
                        <div className="media-preview">
                            {previewUrl.includes('image') ? (
                                <img src={previewUrl} alt="preview"/>
                            ) : (
                                <video src={previewUrl} controls/>
                            )}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Описание:</label>
                    <textarea 
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                    />
                </div>

                <div className="form-group">
                    <label>Хештеги (через пробел):</label>
                    <input 
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#искусство #природа"
                    />
                </div>

                <div className="editor-actions">
                    <button type="submit">Сохранить</button>
                    {onCancel && (
                        <button type="button" onClick={onCancel}>Отмена</button>
                    )}
                </div>
            </form>
        </div>
    )
};

export default PostEditor;