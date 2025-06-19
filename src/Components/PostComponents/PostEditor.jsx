import usePostEditor from "../../hooks/usePostEditor";

const PostEditor = ({ onSave = () => { }, initialPost = null, onCancel = () => { } }) => {

    const {
        caption,
        setCaption,
        hashtags,
        setHashtags,
        previewUrl,
        mediaType,
        handleFileChange,
        handleSubmit,
    } = usePostEditor(initialPost, onSave);

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

                            {mediaType === 'video' ? (
                                <video src={previewUrl} controls />
                            ) : (
                                <img src={previewUrl} alt="preview" />
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