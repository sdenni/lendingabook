const LendRepository = require('../repositories/lendRepository');

class LendController {
  static async lendBooks(req, res) {
    const { memberCode, bookCodes } = req.body; // Pastikan bookCodes adalah array
    try {
      console.log();
      if(bookCodes.length <= 2){
        const lendingId = await LendRepository.lendBooks(memberCode, bookCodes);
        res.status(201).json({ message: 'Books lent successfully', lendingId });
      } else {
        res.status(422).json({ message: 'More than 2 books'})
      }
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to lend books' });
    }
  }

  static async returnBooks(req, res) {
    const { memberCode, lendId } = req.body;
    try {
      await LendRepository.returnBooks(memberCode, lendId);
      res.status(200).json({ message: 'Books returned successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to return books' });
    }
  }

  static async calculatePenalty(req, res) {
    const { lendId } = req.params;
    try {
      const penalty = await LendRepository.calculatePenalty(lendId);
      res.status(200).json({ penalty });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate penalty' });
    }
  }
}

module.exports = LendController;
