import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import mammoth from 'mammoth';

const TextToHtmlConverter = () => {
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handleConvert = () => {
        setIsModalVisible(true); 
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFileUpload = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setHtmlContent(result.value);
            message.success(`${file.name} uploaded successfully`);
        } catch (error) {
            message.error('Failed to convert file');
        }
    };

    return (
        <div>
            <h2>การสร้าง form เอกสาร</h2>
            
            <Upload
                accept=".docx,.doc"
                showUploadList={false}
                beforeUpload={(file) => {
                    handleFileUpload(file);
                    return false;
                }}
            >
                <Button icon={<UploadOutlined />}>Upload file word</Button>
            </Upload>

            <CKEditor
                editor={ClassicEditor}
                data={htmlContent}
                config={{
                    toolbar: [
                        'heading', '|',
                        'bold', 'italic', 'underline', 'strikethrough', 'link', 'bulletedList', 'numberedList', '|',
                        'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'undo', 'redo', 'fontColor', 'fontSize',
                        'fontFamily', 'highlight', 'alignment', 'imageUpload', 'mediaEmbed', 'removeFormat'
                    ],
                    image: {
                        toolbar: [
                            'imageTextAlternative', 'imageStyle:full', 'imageStyle:side'
                        ]
                    }
                }}
                onChange={(_event, editor) => {
                    const data = editor.getData();
                    setHtmlContent(data);
                }}
            />
            <Button type="primary" onClick={handleConvert}>
                Convert to HTML
            </Button>
            <Modal
                title="Converted HTML"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                bodyStyle={{ maxHeight: '400px', overflowY: 'auto' }}
            >
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    <code>{htmlContent}</code>
                </pre>
            </Modal>
        </div>
    );
};

export default TextToHtmlConverter;
