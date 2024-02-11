import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { URL_SERVER } from "../server";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%", // Konten mengikuti lebar layar
    margin: "auto", // Mengatur margin auto secara horizontal
    padding: "10px", // Mengatur padding untuk batas atas, kanan, bawah, dan kiri
    textAlign: "center",
  },
  media: {
    height: 150,
    borderRadius: "10%",
    objectFit: "cover",
    marginBottom: "10px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", // 4 data per baris
    gap: "20px", // Jarak antara kolom
    justifyContent: "center",
  },
  card: {
    maxWidth: "100%", // Kartu mengikuti lebar layar
  },
  cardContent: {
    textAlign: "center",
  },
  pagination: {
    marginBottom: "20px", // Menggeser konten ke bawah
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  // Media query for smaller screens
  "@media (max-width: 768px)": {
    container: {
      gridTemplateColumns: "repeat(1, 1fr)", // 1 data per baris pada layar kecil
    },
  },
});

function Detail() {
  const classes = useStyles();
  const { username } = useParams();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL_SERVER}/proctoring/${username}`);
        const jsonData = await response.json();
        setData(jsonData);
        setTotalPages(jsonData.totalPages);
      } catch (error) {
        console.error("Error fetching proctoring data:", error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, username]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <div className={classes.root}>
      <Container>
      <Typography variant="h4" gutterBottom>
          {/* Data Diri */}
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {username}
            </Typography>
            {/* Tambahkan info lainnya sesuai kebutuhan */}
          </CardContent>
        </Card>
        <br />
        <Typography variant="h4" gutterBottom>
          Data Pengawasan
        </Typography>
      </Container>
      <Container>
        <Grid container spacing={3}>
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <TestimonialCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <br />
    </div>
  );
}

function TestimonialCard({ item }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <img src={item.image_url} alt="Avatar" className={classes.media} />
        <Typography gutterBottom variant="h5" component="h2">
          {item.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {item.course}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
        Engagement Index: {item.confidence}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          EXP: {item.expression}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
  {new Date(item.timestamp).toLocaleString()}
</Typography>

      </CardContent>
    </Card>
  );
}

export default Detail;
