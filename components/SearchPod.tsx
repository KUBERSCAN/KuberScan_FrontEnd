

const SearchPod = () => {
    
  const handleSubmit = (e: Event) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const input = form.pod as HTMLInputElement;
        const pod = input.value.trim();
        if (!pod) return;
        const base64Pod = btoa(pod);
        globalThis.location.href = `/pod/${base64Pod}`;
  };

  return (
    <section class="main">
      <h1>
        <span>SEARCH FOR A SPECIFIC POD</span>
      </h1>

      <form class="login-form" onSubmit={handleSubmit}>
        <h3
          style="
            text-align: center;
            margin-bottom: 30px;
            font-size: 28px;
            font-weight: 700;
            color: #FFFFFF;
          "
        >
          Check if there are alerts on a pod !
        </h3>

        <label for="pod">Pod:</label>
        <input
          type="text"
          id="pod"
          name="pod"
          placeholder="alpine-354383"
          required
        />

        <button type="submit" class="login-btn">
          Search Pod
        </button>
      </form>
    </section>
  );
};

export default SearchPod;
