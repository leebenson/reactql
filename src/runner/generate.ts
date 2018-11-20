import { generate } from "graphql-code-generator";
import { Types } from "graphql-codegen-core";

export const generateSchemaTypings = async (watch: boolean = false) => {
  const documents = ["src/{queries,mutations}/*.{ts,tsx,graphql,gql}"];
  const clientSchema = "src/graphql/client-schema.graphql";
  const remoteSchema = process.env.GRAPHQL;
  const schema = [remoteSchema, clientSchema].filter(e => e);

  const config: Types.Config = {
    generates: {
      "src/graphql/graphql-modules.d.ts": {
        documents,
        plugins: ["typescript-graphql-files-modules"],
        schema,
      },
      "src/graphql/graphql-types.tsx": {
        documents,
        plugins: ["typescript-common", "typescript-client", "typescript-react-apollo"],
        schema,
      },
    },
    overwrite: true,
    watch,
  };

  try {
    return await generate(config, true);
  } catch (e) {
    console.log(e);
  }
};
