require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Hello World Route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Signup Route
app.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError || !authData.user) {
        return res.status(400).json({ error: authError?.message || "User signup failed" });
    }

    // Store user details in the database
    const { data: userData, error: dbError } = await supabase
        .from("users")
        .insert([{ id: authData.user.id, email, name }])
        .select(); // Ensure inserted data is returned

    if (dbError) return res.status(400).json({ error: dbError.message });

    res.json({ message: "Signup successful", user: userData[0] });
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) return res.status(400).json({ error: error?.message || "Login failed" });

    // Fetch user details from the database
    const { data: userData, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

    if (dbError) return res.status(400).json({ error: dbError.message });

    res.json({ message: "Login successful", user: userData });
});

// Logout Route
app.post("/logout", async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Logout successful" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
