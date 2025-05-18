import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    brand: {
      100: '#FFE5C2',
      200: '#FFB547',
      300: '#FF9800', // Primary Orange
      400: '#FF7F00',
      500: '#FF6A00',
      600: '#D95A00',
      700: '#A64400',
      800: '#803000',
      900: '#4C1A00',
    },
    brandScheme: {
      100: '#FFE5C2',
      200: '#FFB547',
      300: '#FF9800',
      400: '#FF7F00',
      500: '#FF6A00',
      600: '#D95A00',
      700: '#A64400',
      800: '#803000',
      900: '#4C1A00',
    },
    darkBlue: {
      100: '#D0E0FF',
      200: '#A6C8FF',
      300: '#7DA0FF',
      400: '#4A78FF',
      500: '#003366', // Primary Dark Blue
      600: '#002855',
      700: '#001F3F',
      800: '#001633',
      900: '#000D26',
    },
    secondaryGray: {
      100: '#E0E5F2',
      200: '#E2E8F0',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#718096',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
    white: {
      50: '#FFFFFF',
      100: '#FDFDFD',
      200: '#F9F9F9',
      300: '#F4F4F4',
      400: '#EEEEEE',
      500: '#E0E0E0',
      600: '#D6D6D6',
      700: '#BDBDBD',
      800: '#A3A3A3',
      900: '#8A8A8A',
    },
    navy: {
      50: '#D0DCFB',
      100: '#AAC0FE',
      200: '#A3B9F8',
      300: '#728FEA',
      400: '#3652BA',
      500: '#1B3BBB',
      600: '#24388A',
      700: '#1B254B',
      800: '#111C44',
      900: '#0B1437',
    },
    gray: {
      100: '#FAFCFE',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        overflowX: 'hidden',
        bg: mode('white', 'darkBlue.700')(props),
        color: mode('black', 'white')(props),
        fontFamily: 'Plus Jakarta Sans',
        transition: 'background 0.3s ease-in-out, color 0.3s ease-in-out',
      },
      input: {
        color: mode('gray.700', 'gray.100')(props),
        bg: mode('white', 'darkBlue.800')(props),
        borderColor: mode('gray.300', 'brand.500')(props),
        _hover: {
          borderColor: mode('brand.400', 'brand.300')(props),
        },
      },
      button: {
        bg: mode('brand.300', 'darkBlue.500')(props),
        color: mode('white', 'white')(props),
        _hover: {
          bg: mode('brand.400', 'darkBlue.400')(props),
        },
      },
      card: {
        bg: mode('white', 'darkBlue.800')(props),
        borderColor: mode('gray.200', 'brand.500')(props),
        boxShadow: mode('0px 4px 10px rgba(255, 152, 0, 0.2)', '0px 4px 10px rgba(255, 152, 0, 0.5)')(props),
      },
      html: {
        fontFamily: 'Plus Jakarta Sans',
      },
    }),
  },
};
