import "./index.footer.css";
export default function footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <>
      <div id="footer">
        <p className="lf">
          Copyright &copy; {year} SpotifyRecommender - All Rights Reserved
        </p>
      </div>
    </>
  );
}
