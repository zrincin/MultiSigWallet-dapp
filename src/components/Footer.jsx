const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#ECF0F1",
        position: "fixed",
        width: "100%",
        left: 0,
        bottom: 0,
      }}
    >
      <div style={{ textAlign: "center" }}>
        &copy; ZrinCin, {new Date().getFullYear()}
        {"."}
      </div>
    </footer>
  );
};

export default Footer;
