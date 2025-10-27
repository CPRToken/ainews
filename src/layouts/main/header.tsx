import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import { useSettingsContext } from 'src/components/settings';

import { paths } from 'src/routes/paths';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Logo from 'src/components/logo';
import Label from 'src/components/label';
// inside your imports
import Image from 'next/image';
import { useRouter } from 'next/router';

import NavMobile from './nav/mobile';
import NavDesktop from './nav/desktop';
import { HEADER } from '../config-layout';
import Searchbar from '../common/searchbar';
import { navConfig } from './config-navigation';
import HeaderShadow from '../common/header-shadow';

import SettingsButton from '../common/settings-button';
import BaseOptions from '../../components/settings/drawer/base-options';

// ----------------------------------------------------------------------

type Props = {
  headerOnDark: boolean;
};

export default function Header({ headerOnDark }: Props) {
  const theme = useTheme();

  const offset = useOffSetTop();

  const mdUp = useResponsive('up', 'md');
  const settings = useSettingsContext();

  const router = useRouter();

  const handleLanguageSwitch = () => {
    const currentPath = router.asPath;
    if (currentPath.startsWith('/es')) {
      router.push(currentPath.replace('/es', '') || '/');
    } else {
      router.push('/es');
    }
  };


  const renderContent = (
    <>
      <Box sx={{ lineHeight: 0, position: 'relative' }}>
        <Link href="/" underline="none">
          <Image
            src="/assets/logo/logonewswh.svg"
            alt="Logo"
            width={350}
            height={70}
            priority
          />

        </Link>



      </Box>

      {mdUp ? (
        <Stack flexGrow={1} alignItems="center" sx={{ height: 1 }}>
          <NavDesktop data={navConfig} />
        </Stack>
      ) : (
        <Box sx={{ flexGrow: 1 }} />
      )}

      <Stack spacing={2} direction="row" alignItems="center" justifyContent="flex-end">
        <Stack spacing={1} direction="row" alignItems="center">
          <Searchbar />
          <Stack spacing={1} direction="row" alignItems="center">


            {/* ✅ Language flag switch */}
            <Box
              sx={{ cursor: 'pointer', width: 40, height: 30 }}
              onClick={handleLanguageSwitch}
            >
              <Image
                src={router.asPath.startsWith('/es') ? '/assets/flags/flag-uk.svg' : '/assets/flags/flag-es.svg'}
                alt="Switch language"
                width={32}
                height={22}
              />
            </Box>
          </Stack>

          <BaseOptions
            title=""
            selected={settings.themeMode === 'dark'}
            onClick={() =>
              settings.onUpdate('themeMode', settings.themeMode === 'dark' ? 'light' : 'dark')
            }
            icons={['carbon:asleep', 'carbon:asleep-filled']}
          />

        </Stack>




        {mdUp && (
          <Button
            variant="contained"
            color="inherit"
            href={paths.zoneStore}
            target="_blank"
            rel="noopener"
          >
           Suscribe
          </Button>
        )}
      </Stack>

      {!mdUp && <NavMobile data={navConfig} />}
    </>
  );

  return (






    <AppBar
      sx={{
        backgroundColor: '#121212', // always dark
        color: 'common.white',
        boxShadow: 'none',
      }}
    >

    <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height', 'background-color'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(headerOnDark && {
            color: 'common.white',
          }),
          ...(offset && {
            ...bgBlur({ color: theme.palette.background.default }),
            color: 'text.primary',
            height: {
              md: HEADER.H_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container
          sx={{
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderContent}
        </Container>
      </Toolbar>

      {offset && <HeaderShadow />}
    </AppBar>
  );
}
