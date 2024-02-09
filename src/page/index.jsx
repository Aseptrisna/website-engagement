import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom"; // Import Link from React Router
import { URL_SERVER } from "../server";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%", // Konten mengikuti lebar layar
    margin: "auto", // Mengatur margin auto secara horizontal
    padding: "10px", // Mengatur padding untuk batas atas, kanan, bawah, dan kiri
    textAlign: "center",
  },
  media: {
    height: 140,
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

function Home() {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${URL_SERVER}/proctoring?page=${currentPage}&limit=${itemsPerPage}`
        );
        const jsonData = await response.json();
        setData(jsonData.data);
        setTotalPages(jsonData.totalPages);
      } catch (error) {
        console.error("Error fetching proctoring data:", error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

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
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Data Engagement
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <br/>
      <Container>
        <div className={classes.container}>
          {data.map((item) => (
            <TestimonialCard
              key={item._id}
              item={item.data}
              classes={classes}
            />
          ))}
        </div>
      </Container>
      <br />
      <div className={classes.pagination}>
        <Button
          variant="contained"
          color="primary"
          disabled={currentPage === 1}
          onClick={prevPage}
        >
          Sebelumnya
        </Button>
        <Typography variant="body1" style={{ margin: "0 10px" }}>
          Halaman {currentPage} dari {totalPages}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={currentPage === totalPages}
          onClick={nextPage}
        >
          Berikutnya
        </Button>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => goToPage(parseInt(e.target.value))}
          style={{ marginLeft: "10px", width: "50px" }}
        />
        <Typography variant="body1">Halaman</Typography>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          style={{ marginLeft: "10px" }}
        >
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="12">12</option>
        </select>
        <Typography variant="body1">Per Halaman</Typography>
      </div>
    </div>
  );
}

function TestimonialCard({ item, classes }) {
  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <img src={item.image_url} alt="Avatar" className={classes.media} />
        <Typography gutterBottom variant="h5" component="h2">
          {item.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          NIM: {item.username}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Kelas: {item.course}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Index Eng: {item.confidence}
        </Typography>
        {/* Link to detail page with username parameter */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/detail/${item.username}`}
        >
          Detail
        </Button>
      </CardContent>
    </Card>
  );
}

export default Home;
