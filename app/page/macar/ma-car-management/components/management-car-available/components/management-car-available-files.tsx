import { DownloadOutlined, EyeOutlined, FileOutlined, FileTextOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Modal, type FormInstance } from "antd";
import React from "react";

export interface props {
  formfiles: FormInstance;
  handleCloseModalFiles: (status: string, a: any) => void;
  openModalFiles: boolean;
  downloadFile: (idfiles: number, filename: string) => void;
}

const ManagementCarAvailableFilesPage: React.FC<props> = ({ formfiles, handleCloseModalFiles, openModalFiles, downloadFile }): React.ReactElement => {
  const values = formfiles.getFieldsValue(true);
  return (
    <div>
      {values.maCarFiles.length > 0 ? (
        <>
          <Modal
            open={openModalFiles}
            onCancel={() => handleCloseModalFiles("close", false)}
            footer={null}
            title={
              <div className="flex items-center gap-2">
                <FileTextOutlined className="text-blue-500" />
                <span className="text-lg font-semibold">ไฟล์แนบทั้งหมด</span>
                <span className="text-sm font-normal text-gray-500">({values.maCarFiles.length} ไฟล์)</span>
              </div>
            }
            width={600}
            className="file-modal">
            <div className="max-h-96 overflow-y-auto">
              {values.maCarFiles.length > 0 ? (
                <div className="space-y-2">
                  {values.maCarFiles.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileOutlined className="text-blue-600 text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <a
                            onClick={() => downloadFile(item.id, item.fileNmae)}
                            className="text-gray-800 hover:text-blue-600 font-medium truncate block">
                            {item.name}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <InboxOutlined className="text-6xl text-gray-300 mb-3" />
                  <p className="text-gray-500">ไม่มีไฟล์แนบ</p>
                </div>
              )}
            </div>
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default ManagementCarAvailableFilesPage;
