import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

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

// ----------------------------------------------------------------------

type Props = {
  headerOnDark: boolean;
};

export default function Header({ headerOnDark }: Props) {
  const theme = useTheme();

  const offset = useOffSetTop();

  const mdUp = useResponsive('up', 'md');

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
            src={
              theme.palette.mode === 'dark'
                ? '/assets/logo/logo-white.svg'
                : '/assets/logo/logo-grey.svg'
            }
            alt="Logo"
            width={240}
            height={50}
            priority
          />
        </Link>


        <Link href="https://zone-docs.vercel.app/changelog" target="_blank" rel="noopener">
          <Label
            color="info"
            sx={{
              ml: 0.5,
              px: 0.5,
              top: -14,
              left: 60,
              height: 20,
              fontSize: 11,
              cursor: 'pointer',
              position: 'absolute',
            }}
          >
      v2.3.0
          </Label>
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

          <SettingsButton />
        </Stack>

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
    <AppBar>
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
