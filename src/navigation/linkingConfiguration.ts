import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<any> = {
  prefixes: ['https://tink.org', 'tink://'],
  config: {
    screens: {
      Home: {
        path: '/'
      },
      Projects: {
        path: 'proyectos',
        screens: {
          ProjectsList: '',
          ProjectDetail: ':projectId/:slug?'
        }
      },
      ONGs: {
        path: 'organizaciones/:ongId?/:slug?'
      }
    }
  }
};

export default linking; 