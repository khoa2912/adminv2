// material-ui
import { Button, CardMedia, Link, Stack, Typography } from "@mui/material";

// project import
import MainCard from "components/MainCard";

// assets
import avatar from "assets/images/users/avatar-group.png";
import AnimateButton from "components/@extended/AnimateButton";

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

const NavCard = () => (
  <MainCard sx={{ bgcolor: "grey.50", m: 3 }}>
    <Stack alignItems="center" spacing={2.5}>
      <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
      <Stack alignItems="center">
        <Typography variant="h5">Laptop Shop</Typography>
      </Stack>
      <AnimateButton>
        <Button
          component={Link}
          target="_blank"
          href="https://www.facebook.com/truonghovan332"
          variant="contained"
          color="success"
          size="small"
        >
          Contact
        </Button>
      </AnimateButton>
    </Stack>
  </MainCard>
);

export default NavCard;
