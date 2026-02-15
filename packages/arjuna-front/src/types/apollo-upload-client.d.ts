declare module 'apollo-upload-client' {
  import { type ApolloLink, type HttpOptions } from '@apollo/client';

  type UploadLinkOptions = HttpOptions & {
    fetch?: typeof fetch;
    isExtractableFile?: (value: unknown) => boolean;
    formDataAppendFile?: (
      form: FormData,
      fieldName: string,
      file: unknown,
    ) => void;
  };

  export const createUploadLink: (options?: UploadLinkOptions) => ApolloLink;
}
