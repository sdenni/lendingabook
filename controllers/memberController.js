const MemberRepository = require('../repositories/memberRepository');
const Member = require('../domain/Member');
const jwt = require('jsonwebtoken');

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
    const { code, name, password } = req.body;
    const newMember = new Member(code, name, password);
    const member = await MemberRepository.create(newMember, 'member');
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Error pembuatan member' });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { code, name, password } = req.body;
    const newMember = new Member(code, name, password);
    const member = await MemberRepository.create(newMember, 'admin');
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: 'Error pembuatan admin' });
  }
};

exports.login = async (req, res) => {
  try {
    const { code, password } = req.body;
    const member = await MemberRepository.login(code, password);
    const token = jwt.sign({ code: member.code, role: member.role }, 'MYSECRETKEY', { expiresIn: '1h' });
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'ada yang salah dengan user dan password anda'})
  }
}
