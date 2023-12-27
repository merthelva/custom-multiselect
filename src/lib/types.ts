type TCharacter = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: Array<string>;
  url: string;
  created: string;
};

type TResponse = {
  info: unknown; // since it does not matter, its type is specified deliberately as "unknown"
  results: Array<TCharacter>;
};

export type { TCharacter, TResponse };
