const active = async (req, res) => {
    try {
        res.status(200).json({ msg: "App started" });

    } catch (error) {
        console.log("Error: ", error);
        res.status(406).json({ error: error });
    }
};



module.exports = {
    active
}
