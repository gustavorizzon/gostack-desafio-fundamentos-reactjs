import React, { useState } from 'react';

import filesize from 'filesize';

import { AxiosResponse } from 'axios';
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [filesToUpload, setFilesToUpload] = useState<FileProps[]>([]);

  async function handleUpload(): Promise<void> {
    await Promise.all(
      filesToUpload.map(
        async (file): Promise<AxiosResponse<any>> => {
          const formData = new FormData();
          formData.append('file', file.file);

          return api.post('/transactions/import', formData);
        },
      ),
    );

    setFilesToUpload([]);
  }

  function submitFile(files: File[]): void {
    const fileList = files.map((file) => {
      const { name, size } = file;

      return { file, name, readableSize: filesize(size) };
    });

    setFilesToUpload([...filesToUpload, ...fileList]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!filesToUpload.length && <FileList files={filesToUpload} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
