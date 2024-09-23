const MemberRepository = require('../repositories/memberRepository');
const Member = require('../domain/Member');

exports.getAllMembers = async (req, res) => {
  try {
    const members = await MemberRepository.findAll();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Error pengambilan data member' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const { code, name } = req.body;
    const newMember = new Member(code, name);
    const member = await MemberRepository.create(newMember);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Error pembuatan member' });
  }
};
