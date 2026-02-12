const Loading = () => {

  const renderLoader = () => {
        return <div class="spinner" />;
    }

  return (
      <div class="loading-content">
        {renderLoader()}
      </div>
  );
};

export default Loading;