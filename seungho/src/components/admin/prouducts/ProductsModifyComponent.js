import React, { useState, useEffect, lazy, Suspense } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ProductsModifyComponent = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedProducts =
      JSON.parse(localStorage.getItem("musicProducts")) || [];
    const updatedAlbum = location.state?.updatedAlbum;

    let newAlbums = [...storedProducts];

    if (updatedAlbum) {
      const albumIndex = newAlbums.findIndex(
        (album) => album.id === updatedAlbum.id
      );
      if (albumIndex !== -1) {
        newAlbums[albumIndex] = updatedAlbum;
        alert("앨범 정보가 성공적으로 업데이트되었습니다!");
      }

      localStorage.setItem("musicProducts", JSON.stringify(newAlbums));
    }

    setAlbums(newAlbums);
  }, [location.state]);

  const handleDetailClick = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };
  const navigate = useNavigate();

  const handleClick = (album) => {
    console.log("버튼아 눌려라", album);
    // 첫 번째 인자는 이동할 경로, 두 번째 인자로 state나 replace 등을 줄 수 있음
    navigate(`/admin/products/modify/${album.id}`, {
      state: { album },
    });
  };
  const handleDelete = (id) => {
    const updatedAlbums = albums.filter((album) => album.id !== id);
    localStorage.setItem("musicProducts", JSON.stringify(updatedAlbums));
    setAlbums(updatedAlbums);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>음원 상품</h2>
      <ul style={styles.albumList}>
        {albums.map((album, index) => (
          <li key={album.id} style={styles.albumItem}>
            <div style={styles.albumRanking}>{index + 1}</div>
            <div style={styles.albumCover}>
              <img
                src={album.coverImage}
                alt={album.title}
                style={styles.coverImage}
              />
            </div>

            <div style={styles.albumInfo}>
              <h3 style={styles.albumTitle}>{album.title}</h3>
              <p style={styles.albumArtist}>{album.artist}</p>
            </div>
            <div style={styles.albumButtons}>
              <button
                style={styles.detailButton}
                onClick={() => handleDetailClick(album)}
              >
                상세 정보
              </button>

              <button
                style={styles.editButton}
                onClick={() => handleClick(album)}
              >
                수정
              </button>

              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(album.id)}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && selectedAlbum && (
        <div style={styles.modal}>
          <button style={styles.closeButton} onClick={closeModal}>
            &times;
          </button>
          <h2 style={styles.modalTitle}>{selectedAlbum.title}</h2>
          <div style={styles.modalContent}>
            <div style={styles.modalImageContainer}>
              <img
                src={selectedAlbum.coverImage}
                alt={selectedAlbum.title}
                style={styles.modalImage}
              />
              {/* 아티스트 이미지 추가 */}
              {selectedAlbum.artistImage && (
                <img
                  src={selectedAlbum.artistImage}
                  alt={selectedAlbum.artist}
                  style={styles.artistImage}
                />
              )}
            </div>
            <div style={styles.modalInfo}>
              <div>
                <p>
                  <strong>아티스트:</strong> {selectedAlbum.artist}
                </p>
                <p>
                  <strong>상품 코드:</strong> {selectedAlbum.productcode}
                </p>
                <p>
                  <strong>가격:</strong> {selectedAlbum.productPrice}
                </p>
                <p>
                  <strong>바코드:</strong> {selectedAlbum.barcode}
                </p>
              </div>
              <div>
                <p>
                  <strong>발매일:</strong> {selectedAlbum.date}
                </p>
                <p>
                  <strong>구성 요소:</strong> {selectedAlbum.componentsInfo}
                </p>
              </div>
              <div>
                <p>
                  <strong>설명:</strong> {selectedAlbum.description}
                </p>
                <p>
                  <strong>트랙 정보:</strong>{" "}
                  {selectedAlbum.trackInfoSongDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Noto Sans KR', sans-serif",
    padding: "0",
    margin: "0",
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
  header: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    borderBottom: "2px solid #333",
    paddingBottom: "10px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  albumList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    width: "100%",
  },
  albumItem: {
    display: "grid",
    gridTemplateColumns: "70px 200px 3fr 200px",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px",
    marginBottom: "0",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  albumRanking: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#e44d26",
    textAlign: "center",
  },
  albumCover: {
    width: "100%",
    height: "100%",
    maxWidth: "120px",
    maxHeight: "120px",
    borderRadius: "6px",
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  albumInfo: {
    flexGrow: 1,
    paddingLeft: "15px",
  },
  albumTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#333",
  },
  albumArtist: {
    fontSize: "16px",
    color: "#666",
  },
  albumButtons: {
    display: "flex",
    gap: "5px",
    justifyContent: "flex-end",
  },
  detailButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  editButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    width: "90%",
    maxWidth: "700px",
    maxHeight: "80vh",
    overflow: "auto",
  },
  modalTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "10px",
  },
  modalImageContainer: {
    width: "40%",
    marginBottom: "0",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  modalImage: {
    width: "100%",
    display: "block",
    objectFit: "cover",
  },
  artistImage: {
    // 아티스트 이미지 스타일 추가
    width: "100%",
    display: "block",
    objectFit: "cover",
    marginTop: "10px",
  },
  modalContent: {
    display: "flex",
    gap: "20px",
  },
  // modalInfo: {
  //   fontSize: "16px",
  //   lineHeight: "1.6",
  //   width: "60%",
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "space-between",
  // }, 모달 창 텍스트 레이아웃 조정하고 싶으면
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    backgroundColor: "transparent",
    color: "#333",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
  },
};

export default ProductsModifyComponent;
